
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const configManager = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painelconfig')
        .setDescription('Painel de configuração do bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const guildConfig = configManager.getGuildConfig(interaction.guild.id);
        
        const embed = new EmbedBuilder()
            .setTitle('🛠️ Painel de Configuração')
            .setDescription('Configure o bot para seu servidor')
            .setColor(0x5865F2)
            .addFields(
                {
                    name: '🎭 Cargos',
                    value: `**Membro:** ${guildConfig.roles.member ? `<@&${guildConfig.roles.member}>` : '❌ Não configurado'}\n**Admin:** ${guildConfig.roles.admin ? `<@&${guildConfig.roles.admin}>` : '❌ Não configurado'}\n**Moderador:** ${guildConfig.roles.moderator ? `<@&${guildConfig.roles.moderator}>` : '❌ Não configurado'}`,
                    inline: true
                },
                {
                    name: '📋 Canais',
                    value: `**Boas-vindas:** ${guildConfig.channels.welcome ? `<#${guildConfig.channels.welcome}>` : '❌ Não configurado'}\n**Verificação:** ${guildConfig.channels.verification ? `<#${guildConfig.channels.verification}>` : '❌ Não configurado'}\n**Logs:** ${guildConfig.channels.logs ? `<#${guildConfig.channels.logs}>` : '❌ Não configurado'}`,
                    inline: true
                },
                {
                    name: '⚙️ Configurações',
                    value: `**Verificação:** ${guildConfig.verification.enabled ? '✅ Ativada' : '❌ Desativada'}\n**Captcha:** ${guildConfig.verification.captcha ? '✅ Ativado' : '❌ Desativado'}\n**Auto-moderação:** ${guildConfig.moderation.automod ? '✅ Ativada' : '❌ Desativada'}`,
                    inline: true
                }
            )
            .setFooter({ text: 'Use os botões abaixo para configurar' });

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_role_member')
                    .setLabel('Cargo Membro')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('👤'),
                new ButtonBuilder()
                    .setCustomId('config_role_admin')
                    .setLabel('Cargo Admin')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('👑'),
                new ButtonBuilder()
                    .setCustomId('config_role_moderator')
                    .setLabel('Cargo Moderador')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🛡️')
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_channel_welcome')
                    .setLabel('Canal Boas-vindas')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('👋'),
                new ButtonBuilder()
                    .setCustomId('config_channel_verification')
                    .setLabel('Canal Verificação')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('✅'),
                new ButtonBuilder()
                    .setCustomId('config_channel_logs')
                    .setLabel('Canal Logs')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋')
            );

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('config_toggle_verification')
                    .setLabel('Toggle Verificação')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🔐'),
                new ButtonBuilder()
                    .setCustomId('config_toggle_captcha')
                    .setLabel('Toggle Captcha')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🧩'),
                new ButtonBuilder()
                    .setCustomId('config_toggle_automod')
                    .setLabel('Toggle Auto-mod')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🤖')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2, row3],
            ephemeral: true
        });
    }
};
