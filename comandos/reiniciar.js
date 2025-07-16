
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reiniciar')
        .setDescription('🔄 Reiniciar o bot (apenas desenvolvedor)'),
    async execute(interaction) {
        if (interaction.user.id !== process.env.DEVELOPER_ID) {
            return interaction.reply({
                content: '❌ Apenas o desenvolvedor pode usar este comando!',
                ephemeral: true
            });
        }
        
        const embed = new EmbedBuilder()
            .setTitle('🔄 Reiniciando Bot')
            .setDescription('Bot será reiniciado em alguns segundos...')
            .setColor(0xff6600)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
        
        setTimeout(() => {
            process.exit(0);
        }, 2000);
    },
};
