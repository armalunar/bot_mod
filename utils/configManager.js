
const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.configPath = path.join(__dirname, '../config.json');
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const data = fs.readFileSync(this.configPath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
        }
        
        // Configuração padrão
        return {
            guilds: {}
        };
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            return true;
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            return false;
        }
    }

    getGuildConfig(guildId) {
        if (!this.config.guilds[guildId]) {
            this.config.guilds[guildId] = {
                roles: {
                    member: null,
                    admin: null,
                    moderator: null
                },
                channels: {
                    welcome: null,
                    verification: null,
                    logs: null
                },
                verification: {
                    enabled: false,
                    captcha: true
                },
                moderation: {
                    automod: false,
                    antiSpam: false
                }
            };
            this.saveConfig();
        }
        return this.config.guilds[guildId];
    }

    setGuildConfig(guildId, key, value) {
        const guildConfig = this.getGuildConfig(guildId);
        
        // Suporte para nested keys (ex: "roles.member")
        const keys = key.split('.');
        let current = guildConfig;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return this.saveConfig();
    }

    getRoleConfig(guildId, roleType) {
        const config = this.getGuildConfig(guildId);
        return config.roles[roleType];
    }

    setRoleConfig(guildId, roleType, roleId) {
        return this.setGuildConfig(guildId, `roles.${roleType}`, roleId);
    }
}

module.exports = new ConfigManager();
