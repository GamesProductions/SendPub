/**
 * Fires when the bot joins a new guild
 * @module events/guildCreate
 * @param {Discord.Client} client - The Discord client
 * @param {Discord.Guild} guild - The guild the bot joined
 */

module.exports = async (client, guild) => {
  client.logger.log(`J'ai rejoint la serveur ${guild.name}`)
  client.database.run('INSERT OR IGNORE INTO settings (guildid) VALUES (?)', [guild.id])
}
