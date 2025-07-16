const { InteractionType, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { carregarConfiguracoes, salvarConfiguracoes } = require('../utils/configManager');
const { criarEmbedConfiguracoes, criarMenuPrincipal, criarMenuCargos, criarMenuCanais, criarMenuSistemas, criarMenuMensagens } = require('../painel/painelConfig');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                return await interaction.reply({ 
                    content: '❌ Comando não encontrado!', 
                    ephemeral: true 
                });
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erro ao executar comando ${interaction.commandName}:`, error);

                const errorMessage = { 
                    content: '❌ Houve um erro ao executar este comando!', 
                    ephemeral: true 
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }

        // Handling select menu interactions
        if (interaction.type === InteractionType.MessageComponent) {
            if (!interaction.member.permissions.has('Administrator')) {
                return await interaction.reply({
                    content: '❌ Você não tem permissão para usar este painel!',
                    ephemeral: true
                });
            }

            const config = carregarConfiguracoes(interaction.guild.id);

            try {
                if (interaction.customId === 'painel_config_menu') {
                    const value = interaction.values[0];

                    switch (value) {
                        case 'cargos':
                            await interaction.update({
                                embeds: [criarEmbedConfiguracoes(config, 'cargos')],
                                components: [criarMenuCargos(), criarMenuPrincipal()]
                            });
                            break;

                        case 'canais':
                            await interaction.update({
                                embeds: [criarEmbedConfiguracoes(config, 'canais')],
                                components: [criarMenuCanais(), criarMenuPrincipal()]
                            });
                            break;

                        case 'sistemas':
                            await interaction.update({
                                embeds: [criarEmbedConfiguracoes(config, 'sistemas')],
                                components: [criarMenuSistemas(), criarMenuPrincipal()]
                            });
                            break;

                        case 'mensagens':
                            await interaction.update({
                                embeds: [criarEmbedConfiguracoes(config, 'mensagens')],
                                components: [criarMenuMensagens(), criarMenuPrincipal()]
                            });
                            break;

                        case 'voltar':
                            await interaction.update({
                                embeds: [criarEmbedConfiguracoes(config, 'geral')],
                                components: [criarMenuPrincipal()]
                            });
                            break;
                    }
                }

                // Handle cargo configurations
                else if (interaction.customId === 'config_cargos') {
                    const value = interaction.values[0];

                    // Show role selection menu
                    const roleOptions = interaction.guild.roles.cache
                        .filter(role => !role.managed && role.name !== '@everyone')
                        .first(25)
                        .map(role => ({
                            label: role.name,
                            value: role.id,
                            description: `ID: ${role.id}`
                        }));

                    if (roleOptions.length === 0) {
                        return await interaction.reply({
                            content: '❌ Nenhum cargo disponível para configurar!',
                            ephemeral: true
                        });
                    }

                    const selectRole = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId(`select_role_${value}`)
                                .setPlaceholder(`Selecione o cargo para ${value}`)
                                .addOptions(roleOptions)
                        );

                    await interaction.update({
                        content: `Selecione o cargo para **${value}**:`,
                        embeds: [],
                        components: [selectRole]
                    });
                }

                // Handle role selection
                else if (interaction.customId.startsWith('select_role_')) {
                    const type = interaction.customId.replace('select_role_', '');
                    const roleId = interaction.values[0];
                    const role = interaction.guild.roles.cache.get(roleId);

                    if (!role) {
                        return await interaction.reply({
                            content: '❌ Cargo não encontrado!',
                            ephemeral: true
                        });
                    }

                    switch (type) {
                        case 'verificacao':
                            config.cargoVerificacao = roleId;
                            break;
                        case 'staff':
                            config.cargoStaff = roleId;
                            break;
                        case 'moderacao':
                            config.cargoModeracao = roleId;
                            break;
                    }

                    salvarConfiguracoes(interaction.guild.id, config);

                    await interaction.update({
                        embeds: [criarEmbedConfiguracoes(config, 'cargos')],
                        components: [criarMenuCargos(), criarMenuPrincipal()]
                    });

                    await interaction.followUp({
                        content: `✅ Cargo de ${type} definido como: ${role.name}`,
                        ephemeral: true
                    });
                }

                // Handle channel configurations
                else if (interaction.customId === 'config_canais') {
                    const value = interaction.values[0];

                    // Show channel selection menu
                    const channelOptions = interaction.guild.channels.cache
                        .filter(channel => channel.type === 0) // Text channels only
                        .first(25)
                        .map(channel => ({
                            label: channel.name,
                            value: channel.id,
                            description: `ID: ${channel.id}`
                        }));

                    if (channelOptions.length === 0) {
                        return await interaction.reply({
                            content: '❌ Nenhum canal disponível para configurar!',
                            ephemeral: true
                        });
                    }

                    const selectChannel = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId(`select_channel_${value}`)
                                .setPlaceholder(`Selecione o canal para ${value}`)
                                .addOptions(channelOptions)
                        );

                    await interaction.update({
                        content: `Selecione o canal para **${value}**:`,
                        embeds: [],
                        components: [selectChannel]
                    });
                }

                // Handle channel selection
                else if (interaction.customId.startsWith('select_channel_')) {
                    const type = interaction.customId.replace('select_channel_', '');
                    const channelId = interaction.values[0];
                    const channel = interaction.guild.channels.cache.get(channelId);

                    if (!channel) {
                        return await interaction.reply({
                            content: '❌ Canal não encontrado!',
                            ephemeral: true
                        });
                    }

                    switch (type) {
                        case 'logs':
                            config.canalLogs = channelId;
                            break;
                        case 'boasvindas':
                            config.canalBoasVindas = channelId;
                            break;
                        case 'verificacao':
                            config.canalVerificacao = channelId;
                            break;
                    }

                    salvarConfiguracoes(interaction.guild.id, config);

                    await interaction.update({
                        embeds: [criarEmbedConfiguracoes(config, 'canais')],
                        components: [criarMenuCanais(), criarMenuPrincipal()]
                    });

                    await interaction.followUp({
                        content: `✅ Canal de ${type} definido como: ${channel.name}`,
                        ephemeral: true
                    });
                }

                // Handle system toggles
                else if (interaction.customId === 'config_sistemas') {
                    const value = interaction.values[0];

                    switch (value) {
                        case 'verificacao':
                            config.verificacaoAtiva = !config.verificacaoAtiva;
                            break;
                        case 'logs':
                            config.logsAtivos = !config.logsAtivos;
                            break;
                        case 'moderacao':
                            config.moderacaoAtiva = !config.moderacaoAtiva;
                            break;
                        case 'dmwelcome':
                            config.dmWelcomeAtivo = !config.dmWelcomeAtivo;
                            break;
                    }

                    salvarConfiguracoes(interaction.guild.id, config);

                    await interaction.update({
                        embeds: [criarEmbedConfiguracoes(config, 'sistemas')],
                        components: [criarMenuSistemas(), criarMenuPrincipal()]
                    });

                    const status = config[value + 'Ativa'] || config[value + 'Ativos'] || config[value + 'Ativo'] ? 'ativado' : 'desativado';
                    await interaction.followUp({
                        content: `✅ Sistema ${value} ${status}!`,
                        ephemeral: true
                    });
                }

            } catch (error) {
                console.error('Erro na interação do painel:', error);

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: '❌ Erro ao processar a interação!',
                        ephemeral: true
                    });
                }
            }
        }
    }
};