
const { EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/database');
const { sendDMWelcome } = require('../utils/welcome');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const config = getGuildConfig(member.guild.id);
        
        // Enviar DM de boas-vindas se ativado
        if (config.systems.dmWelcome) {
            await sendDMWelcome(member);
        }
        
        // Enviar mensagem no canal de boas-vindas
        if (config.channels.welcome && config.systems.welcome) {
            const channel = member.guild.channels.cache.get(config.channels.welcome);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle('👋 Bem-vindo(a)!')
                    .setDescription(config.messages.welcome.replace('{user}', member.toString()).replace('{server}', member.guild.name))
                    .setColor(0x00ff00)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp();
                
                channel.send({ embeds: [embed] });
            }
        }
        
        // Log
        if (config.channels.logs && config.systems.logs) {
            const logChannel = member.guild.channels.cache.get(config.channels.logs);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('📥 Membro entrou')
                    .setDescription(`${member.user.tag} entrou no servidor`)
                    .addFields([
                        { name: 'ID', value: member.user.id, inline: true },
                        { name: 'Conta criada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
                    ])
                    .setColor(0x00ff00)
                    .setTimestamp();
                
                logChannel.send({ embeds: [logEmbed] });
            }
        }
    },
};
