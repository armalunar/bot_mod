
const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(chalk.green(`✅ Bot conectado como ${client.user.tag}!`));
        console.log(chalk.blue(`📊 Conectado em ${client.guilds.cache.size} servidores`));
        
        // Definir status
        client.user.setActivity('🤖 Sistema de moderação ativo', { type: 'WATCHING' });
    },
};
