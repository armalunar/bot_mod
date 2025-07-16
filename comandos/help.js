
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📚 Mostra lista de comandos disponíveis'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('📚 Lista de Comandos')
            .setDescription('Aqui estão todos os comandos disponíveis:')
            .addFields([
                {
                    name: '🔧 **Utilidade**',
                    value: '`/ping` - Latência do bot\n`/help` - Lista de comandos\n`/status` - Status do bot',
                    inline: false
                },
                {
                    name: '⚙️ **Configuração**',
                    value: '`/painelconfig` - Painel de configuração\n`/setarpainelverificacao` - Configurar verificação',
                    inline: false
                },
                {
                    name: '🛡️ **Moderação**',
                    value: '`/ban` - Banir usuário\n`/kick` - Expulsar usuário\n`/mute` - Silenciar usuário\n`/warn` - Advertir usuário\n`/clear` - Limpar mensagens',
                    inline: false
                }
            ])
            .setColor(0x3498db)
            .setTimestamp()
            .setFooter({ text: 'Bot de Moderação', iconURL: interaction.client.user.displayAvatarURL() });
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
