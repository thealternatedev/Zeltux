const Giveaway = require('../models/Giveaway')
const { Events } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (
            interaction.isButton() &&
            interaction.customId === 'join_giveaway'
        ) {
            const giveaway = await Giveaway.findOne({
                messageId: interaction.message.id,
                ongoing: true,
            })

            if (!giveaway) {
                return interaction.reply({
                    content: 'This giveaway has ended or does not exist.',
                    ephemeral: true,
                })
            }

            if (
                giveaway.requiredRole &&
                !interaction.member.roles.cache.has(giveaway.requiredRole)
            ) {
                return interaction.reply({
                    content: `You need the role <@&${giveaway.requiredRole}> to join this giveaway.`,
                    ephemeral: true,
                })
            }

            if (giveaway.participants.includes(interaction.user.id)) {
                return interaction.reply({
                    content: 'You are already participating in this giveaway!',
                    ephemeral: true,
                })
            }

            giveaway.participants.push(interaction.user.id)
            await giveaway.save()

            await interaction.reply({
                content: 'You have successfully joined the giveaway!',
                ephemeral: true,
            })
        }
    },
}