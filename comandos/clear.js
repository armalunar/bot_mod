
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('🗑️ Limpar mensagens do canal')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Número de mensagens para deletar (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('quantidade');
        const config = getGuildConfig(interaction.guild.id);
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '❌ Você não tem permissão para gerenciar mensagens!',
                ephemeral: true
            });
        }
        
        try {
            const deleted = await interaction.channel.bulkDelete(amount, true);
            
            await interaction.reply({
                content: `🗑️ **${deleted.size}** mensagens foram deletadas!`,
                ephemeral: true
            });
            
            // Log
            if (config.channels.logs && config.systems.logs) {
                const logChannel = interaction.guild.channels.cache.get(config.channels.logs);
                if (logChannel && logChannel.id !== interaction.channel.id) {
                    logChannel.send(`🗑️ **${interaction.user.tag}** deletou **${deleted.size}** mensagens em ${interaction.channel}`);
                }
            }
            
        } catch (error) {
            console.error('Erro ao deletar mensagens:', error);
            await interaction.reply({
                content: '❌ Erro ao deletar mensagens! (Mensagens muito antigas não podem ser deletadas)',
                ephemeral: true
            });
        }
    },
};
