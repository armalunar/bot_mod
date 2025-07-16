
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getGuildConfig, saveGuildConfig } = require('./database');

async function handleConfigPanel(interaction) {
    const config = getGuildConfig(interaction.guild.id);
    const [action, type] = interaction.customId.split('_');
    
    if (action === 'config') {
        switch (type) {
            case 'main':
                await handleMainConfig(interaction, config);
                break;
            case 'roles':
                await handleRolesConfig(interaction, config);
                break;
            case 'channels':
                await handleChannelsConfig(interaction, config);
                break;
            case 'systems':
                await handleSystemsConfig(interaction, config);
                break;
            case 'messages':
                await handleMessagesConfig(interaction, config);
                break;
            case 'status':
                await handleStatusConfig(interaction, config);
                break;
        }
    }
}

async function handleMainConfig(interaction, config) {
    const value = interaction.values[0];
    
    const embeds = {
        roles: new EmbedBuilder()
            .setTitle('🔐 Configuração de Cargos')
            .setDescription('Configure os cargos utilizados pelo bot:')
            .setColor(0x3498db),
        channels: new EmbedBuilder()
            .setTitle('📝 Configuração de Canais')
            .setDescription('Configure os canais utilizados pelo bot:')
            .setColor(0x3498db),
        systems: new EmbedBuilder()
            .setTitle('🔧 Configuração de Sistemas')
            .setDescription('Ative ou desative funcionalidades do bot:')
            .setColor(0x3498db),
        messages: new EmbedBuilder()
            .setTitle('💬 Configuração de Mensagens')
            .setDescription('Personalize as mensagens do bot:')
            .setColor(0x3498db),
        status: new EmbedBuilder()
            .setTitle('✅ Status das Configurações')
            .setDescription('Configurações atuais do servidor:')
            .setColor(0x00ff00)
    };
    
    const components = {
        roles: [
            new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('set_verified_role')
                    .setPlaceholder('Selecionar cargo de verificado')
            ),
            new ActionRowBuilder().addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('set_staff_role')
                    .setPlaceholder('Selecionar cargo de staff')
            )
        ],
        channels: [
            new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('set_logs_channel')
                    .setPlaceholder('Selecionar canal de logs')
            ),
            new ActionRowBuilder().addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('set_welcome_channel')
                    .setPlaceholder('Selecionar canal de boas-vindas')
            )
        ],
        systems: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`toggle_logs_${!config.systems.logs}`)
                    .setLabel(`Logs: ${config.systems.logs ? 'ON' : 'OFF'}`)
                    .setStyle(config.systems.logs ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`toggle_verification_${!config.systems.verification}`)
                    .setLabel(`Verificação: ${config.systems.verification ? 'ON' : 'OFF'}`)
                    .setStyle(config.systems.verification ? ButtonStyle.Success : ButtonStyle.Danger)
            )
        ]
    };
    
    if (value === 'status') {
        embeds.status.addFields([
            { name: '🔐 Cargo Verificado', value: config.roles.verified ? `<@&${config.roles.verified}>` : 'Não configurado', inline: true },
            { name: '👮 Cargo Staff', value: config.roles.staff ? `<@&${config.roles.staff}>` : 'Não configurado', inline: true },
            { name: '📋 Canal de Logs', value: config.channels.logs ? `<#${config.channels.logs}>` : 'Não configurado', inline: true },
            { name: '👋 Canal Boas-vindas', value: config.channels.welcome ? `<#${config.channels.welcome}>` : 'Não configurado', inline: true },
            { name: '📊 Sistema de Logs', value: config.systems.logs ? '✅ Ativo' : '❌ Inativo', inline: true },
            { name: '🔐 Sistema de Verificação', value: config.systems.verification ? '✅ Ativo' : '❌ Inativo', inline: true }
        ]);
        
        return interaction.update({
            embeds: [embeds.status],
            components: []
        });
    }
    
    await interaction.update({
        embeds: [embeds[value]],
        components: components[value] || []
    });
}

module.exports = {
    handleConfigPanel
};
