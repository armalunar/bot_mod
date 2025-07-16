
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Mostra a latência do bot'),
    cooldown: 3,
    async execute(interaction) {
        const start = Date.now();
        
        await interaction.reply('🏓 Calculando ping...');
        
        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .addFields([
                { name: '⚡ Latência da API', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
                { name: '🔄 Latência do Bot', value: `${Date.now() - start}ms`, inline: true }
            ])
            .setColor(0x00ff00)
            .setTimestamp();
        
        await interaction.editReply({ content: '', embeds: [embed] });
    },
};
