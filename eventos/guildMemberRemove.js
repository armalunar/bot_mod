
const { EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/database');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const config = getGuildConfig(member.guild.id);
        
        // Mensagem de despedida
        if (config.channels.welcome && config.systems.welcome) {
            const channel = member.guild.channels.cache.get(config.channels.welcome);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle('👋 Tchau!')
                    .setDescription(config.messages.goodbye.replace('{user}', member.user.tag).replace('{server}', member.guild.name))
                    .setColor(0xff0000)
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
                    .setTitle('📤 Membro saiu')
                    .setDescription(`${member.user.tag} saiu do servidor`)
                    .addFields([
                        { name: 'ID', value: member.user.id, inline: true },
                        { name: 'Entrou em', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Desconhecido', inline: true }
                    ])
                    .setColor(0xff0000)
                    .setTimestamp();
                
                logChannel.send({ embeds: [logEmbed] });
            }
        }
    },
};
