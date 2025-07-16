
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🔨 Banir um usuário do servidor')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário a ser banido')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('usuário');
        const reason = interaction.options.getString('motivo') || 'Não especificado';
        const config = getGuildConfig(interaction.guild.id);
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '❌ Você não tem permissão para banir membros!',
                ephemeral: true
            });
        }
        
        const member = interaction.guild.members.cache.get(target.id);
        
        if (!member) {
            return interaction.reply({
                content: '❌ Usuário não encontrado no servidor!',
                ephemeral: true
            });
        }
        
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: '❌ Você não pode banir este usuário!',
                ephemeral: true
            });
        }
        
        try {
            // Enviar DM para o usuário
            try {
                const dmEmbed = new EmbedBuilder()
                    .setTitle('🔨 Você foi banido!')
                    .setDescription(`Você foi banido do servidor **${interaction.guild.name}**`)
                    .addFields([
                        { name: 'Motivo', value: reason },
                        { name: 'Moderador', value: interaction.user.tag }
                    ])
                    .setColor(0xff0000)
                    .setTimestamp();
                
                await target.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log('Não foi possível enviar DM para o usuário banido');
            }
            
            // Banir usuário
            await member.ban({ reason: `${reason} | Por: ${interaction.user.tag}` });
            
            // Resposta de confirmação
            const embed = new EmbedBuilder()
                .setTitle('🔨 Usuário Banido')
                .setDescription(`**${target.tag}** foi banido com sucesso!`)
                .addFields([
                    { name: 'Motivo', value: reason },
                    { name: 'Moderador', value: interaction.user.tag }
                ])
                .setColor(0xff0000)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
            // Log
            if (config.channels.logs && config.systems.logs) {
                const logChannel = interaction.guild.channels.cache.get(config.channels.logs);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('🔨 Banimento')
                        .addFields([
                            { name: 'Usuário', value: `${target.tag} (${target.id})` },
                            { name: 'Moderador', value: `${interaction.user.tag} (${interaction.user.id})` },
                            { name: 'Motivo', value: reason },
                            { name: 'Canal', value: interaction.channel.toString() }
                        ])
                        .setColor(0xff0000)
                        .setTimestamp();
                    
                    logChannel.send({ embeds: [logEmbed] });
                }
            }
            
        } catch (error) {
            console.error('Erro ao banir usuário:', error);
            await interaction.reply({
                content: '❌ Erro ao banir usuário!',
                ephemeral: true
            });
        }
    },
};
