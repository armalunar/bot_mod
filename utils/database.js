
const fs = require('fs');
const path = require('path');

const defaultConfig = {
    roles: {
        verified: null,
        staff: null,
        muted: null
    },
    channels: {
        logs: null,
        welcome: null,
        verification: null
    },
    systems: {
        logs: false,
        verification: false,
        moderation: false,
        dmWelcome: false,
        welcome: false
    },
    messages: {
        welcome: 'Bem-vindo(a) {user} ao servidor {server}! 🎉',
        goodbye: '{user} saiu do servidor {server}. Até mais! 👋',
        dmWelcome: 'Olá! Bem-vindo(a) ao nosso servidor! Por favor, leia as regras e se divirta! 🎉'
    },
    prefix: '!',
    verification: {
        changeNickname: false,
        nicknameFormat: 'Verificado | {username}'
    }
};

function getGuildConfig(guildId) {
    const configPath = path.join(__dirname, '..', 'dados', `${guildId}.json`);
    
    if (!fs.existsSync(configPath)) {
        saveGuildConfig(guildId, defaultConfig);
        return defaultConfig;
    }
    
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return { ...defaultConfig, ...JSON.parse(data) };
    } catch (error) {
        console.error('Erro ao ler config:', error);
        return defaultConfig;
    }
}

function saveGuildConfig(guildId, config) {
    const configPath = path.join(__dirname, '..', 'dados', `${guildId}.json`);
    const dadosDir = path.join(__dirname, '..', 'dados');
    
    if (!fs.existsSync(dadosDir)) {
        fs.mkdirSync(dadosDir, { recursive: true });
    }
    
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Erro ao salvar config:', error);
    }
}

module.exports = {
    getGuildConfig,
    saveGuildConfig,
    defaultConfig
};
