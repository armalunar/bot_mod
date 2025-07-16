
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { createCanvas } = require('canvas');
const { getGuildConfig } = require('./database');

// Gerar captcha simples
function generateCaptcha() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Criar imagem do captcha
function createCaptchaImage(text) {
    const canvas = createCanvas(200, 80);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 200, 80);
    
    // Noise lines
    ctx.strokeStyle = '#cccccc';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 200, Math.random() * 80);
        ctx.lineTo(Math.random() * 200, Math.random() * 80);
        ctx.stroke();
    }
    
    // Text
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 100, 50);
    
    return canvas.toBuffer();
}

async function handleVerificationButton(interaction) {
    const config = getGuildConfig(interaction.guild.id);
    
    if (!config.systems.verification) {
        return interaction.reply({
            content: '❌ Sistema de verificação não está ativado!',
            ephemeral: true
        });
    }
    
    // Verificar se já possui o cargo
    const verifiedRole = interaction.guild.roles.cache.get(config.roles.verified);
    if (verifiedRole && interaction.member.roles.cache.has(verifiedRole.id)) {
        return interaction.reply({
            content: '✅ Você já está verificado!',
            ephemeral: true
        });
    }
    
    // Gerar captcha
    const captchaText = generateCaptcha();
    const captchaImage = createCaptchaImage(captchaText);
    
    // Salvar resposta temporariamente
    if (!interaction.client.captchaAnswers) {
        interaction.client.captchaAnswers = new Map();
    }
    interaction.client.captchaAnswers.set(interaction.user.id, captchaText);
    
    // Criar modal
    const modal = new ModalBuilder()
        .setCustomId('verification_modal')
        .setTitle('🔐 Verificação de Segurança');
    
    const captchaInput = new TextInputBuilder()
        .setCustomId('captcha_answer')
        .setLabel('Digite o código da imagem abaixo:')
        .setStyle(TextInputStyle.Short)
        .setMinLength(5)
        .setMaxLength(5)
        .setRequired(true);
    
    const actionRow = new ActionRowBuilder().addComponents(captchaInput);
    modal.addComponents(actionRow);
    
    // Enviar imagem e modal
    await interaction.reply({
        content: '🔐 **Verificação de Segurança**\nDigite o código mostrado na imagem:',
        files: [{ attachment: captchaImage, name: 'captcha.png' }],
        ephemeral: true
    });
    
    await interaction.followUp({
        content: 'Clique no botão abaixo para inserir o código:',
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('open_captcha_modal')
                    .setLabel('✏️ Inserir Código')
                    .setStyle(ButtonStyle.Primary)
            )
        ],
        ephemeral: true
    });
}

module.exports = {
    generateCaptcha,
    createCaptchaImage,
    handleVerificationButton
};
