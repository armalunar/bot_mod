function criarMenuCargos() {
    return new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('config_cargos')
                .setPlaceholder('Selecione um cargo para configurar')
                .addOptions([
                    {
                        label: 'Cargo de Verificação',
                        value: 'verificacao',
                        description: 'Cargo dado após verificação'
                    },
                    {
                        label: 'Cargo de Staff',
                        value: 'staff',
                        description: 'Cargo da equipe do servidor'
                    },
                    {
                        label: 'Cargo de Moderação',
                        value: 'moderacao',
                        description: 'Cargo com permissões de moderação'
                    }
                ])
        );
}

function criarMenuCanais() {
    return new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('config_canais')
                .setPlaceholder('Selecione um canal para configurar')
                .addOptions([
                    {
                        label: 'Canal de Logs',
                        value: 'logs',
                        description: 'Canal para logs do bot'
                    },
                    {
                        label: 'Canal de Boas-vindas',
                        value: 'boasvindas',
                        description: 'Canal para mensagens de boas-vindas'
                    },
                    {
                        label: 'Canal de Verificação',
                        value: 'verificacao',
                        description: 'Canal para o painel de verificação'
                    }
                ])
        );
}