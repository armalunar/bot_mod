
const { PermissionFlagsBits } = require('discord.js');

function isAdmin(member) {
    return member.permissions.has(PermissionFlagsBits.Administrator);
}

function isModerator(member) {
    return member.permissions.has(PermissionFlagsBits.ModerateMembers) || 
           member.permissions.has(PermissionFlagsBits.KickMembers) ||
           member.permissions.has(PermissionFlagsBits.BanMembers);
}

function hasPermission(member, permission) {
    return member.permissions.has(permission);
}

module.exports = {
    isAdmin,
    isModerator,
    hasPermission
};
