
const { EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('./database');

async function sendDMWelcome(member) {
    const config = getGuildConfig(member.guild.id);
    
    try {
        const embed = new EmbedBuilder()
            .setTitle(`👋 Bem-vindo(a) ao ${member.guild.name}!`)
            .setDescription(config.messages.dmWelcome)
            .setColor(0x00ff00)
            .setThumbnail(member.guild.iconURL())
            .addFields([
                { name: '📋 Regras', value: 'Leia as regras do servidor!', inline: true },
                { name: '🎯 Verificação', value: 'Complete a verificação se necessário!', inline: true }
            ])
            .setTimestamp();
        
        await member.send({ embeds: [embed] });
    } catch (error) {
        console.log(`Não foi possível enviar DM para ${member.user.tag}`);
    }
}

module.exports = {
    sendDMWelcome
};
