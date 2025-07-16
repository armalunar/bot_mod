
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
require('dotenv').config();

// Criar cliente do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ]
});

// Collections para comandos
client.commands = new Collection();
client.cooldowns = new Collection();

// Função para carregar comandos
async function loadCommands() {
    const commandsPath = path.join(__dirname, 'comandos');
    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
        return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(chalk.green(`✅ Comando carregado: ${command.data.name}`));
        } else {
            console.log(chalk.yellow(`⚠️ Comando em ${file} está faltando propriedade "data" ou "execute"`));
        }
    }

    // Registrar comandos slash
    if (commands.length > 0) {
        const rest = new REST().setToken(process.env.TOKEN);
        try {
            console.log(chalk.blue(`🔄 Registrando ${commands.length} comandos...`));
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            console.log(chalk.green('✅ Comandos registrados com sucesso!'));
        } catch (error) {
            console.error(chalk.red('❌ Erro ao registrar comandos:'), error);
        }
    }
}

// Função para carregar eventos
function loadEvents() {
    const eventsPath = path.join(__dirname, 'eventos');
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
        return;
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        delete require.cache[require.resolve(filePath)];
        const event = require(filePath);
        
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(chalk.green(`✅ Evento carregado: ${event.name}`));
    }
}

// Comando para hot reload
client.on('messageCreate', async (message) => {
    if (message.content === '!reload' && message.author.id === process.env.DEVELOPER_ID) {
        try {
            await loadCommands();
            loadEvents();
            message.reply('🔄 Bot recarregado com sucesso!');
        } catch (error) {
            message.reply('❌ Erro ao recarregar: ' + error.message);
        }
    }
});

// Inicializar bot
async function init() {
    console.log(chalk.blue('🤖 Iniciando bot...'));
    
    // Criar pastas necessárias
    const dirs = ['comandos', 'eventos', 'painel', 'utils', 'dados'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Carregar comandos e eventos
    await loadCommands();
    loadEvents();
    
    // Login
    client.login(process.env.TOKEN);
}

init();
