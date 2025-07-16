
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('📊 Mostra informações sobre o bot'),
    async execute(interaction) {
        const uptime = moment.duration(interaction.client.uptime).humanize();
        const memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        
        const embed = new EmbedBuilder()
            .setTitle('📊 Status do Bot')
            .addFields([
                { name: '⏰ Uptime', value: uptime, inline: true },
                { name: '🖥️ Uso de Memória', value: `${memoryUsage} MB`, inline: true },
                { name: '🏓 Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
                { name: '🌐 Servidores', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: '👥 Usuários', value: `${interaction.client.users.cache.size}`, inline: true },
                { name: '📝 Comandos', value: `${interaction.client.commands.size}`, inline: true }
            ])
            .setColor(0x00ff00)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};
