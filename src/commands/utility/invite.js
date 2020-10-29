/**
 * Sends a dynamic bot invite link to the executor.
 * @module commands/invite
 */

/**
 * Execute command
 * @param {Discord.Client} client - The Discord client
 * @param {Discord.Message} message - The message of the command
 * @param {string} args - The arguments of the command
 */
exports.run = async (client, message, args) => {
  client.embed.send(message, { desc: 'Je vous ai envoyé un message privé avec le lien d invitation du bot.' })
  message.author.send(`<https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=27681>`)
}

/** Command Config */
exports.conf = {
  enabled: true,
  aliases: [],
  guildOnly: false,
  permLevel: 'User'
}

/** Command Help */
exports.help = {
  name: 'invite',
  usage: '',
  description: 'Invitez le bot.'
}
