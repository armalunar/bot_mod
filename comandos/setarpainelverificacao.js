
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { isAdmin } = require('../utils/permissions');
const { getGuildConfig } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setarpainelverificacao')
        .setDescription('🔐 Criar painel de verificação com captcha')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (!isAdmin(interaction.member)) {
            return interaction.reply({
                content: '❌ Você precisa ser administrador para usar este comando!',
                ephemeral: true
            });
        }
        
        const config = getGuildConfig(interaction.guild.id);
        
        if (!config.systems.verification) {
            return interaction.reply({
                content: '❌ Sistema de verificação não está ativado! Use `/painelconfig` para ativá-lo.',
                ephemeral: true
            });
        }
        
        if (!config.roles.verified) {
            return interaction.reply({
                content: '❌ Cargo de verificação não configurado! Use `/painelconfig` para configurá-lo.',
                ephemeral: true
            });
        }
        
        const embed = new EmbedBuilder()
            .setTitle('🔐 Verificação de Segurança')
            .setDescription(
                '**Bem-vindo(a) ao servidor!**\n\n' +
                'Para acessar todos os canais, você precisa completar a verificação de segurança.\n\n' +
                '🔹 Clique no botão abaixo\n' +
                '🔹 Resolva o captcha apresentado\n' +
                '🔹 Receba seu cargo de membro verificado\n\n' +
                '⚠️ **Importante:** Este processo é automático e necessário para a segurança do servidor.'
            )
            .setColor(0x3498db)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: 'Sistema de Verificação', iconURL: interaction.client.user.displayAvatarURL() });
        
        const button = new ButtonBuilder()
            .setCustomId('verification_button')
            .setLabel('🔐 Iniciar Verificação')
            .setStyle(ButtonStyle.Primary);
        
        const row = new ActionRowBuilder().addComponents(button);
        
        await interaction.reply({
            content: '✅ Painel de verificação criado!',
            ephemeral: true
        });
        
        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });
    },
};
