/**
 * Fires when the bot leaves a guild
 * @module events/guildDelete
 * @param {Discord.Client} client - The Discord client
 * @param {Discord.Guild} guild - The guild the bot left
 */

module.exports = async (client, guild) => {
  client.logger.log(`J'ai quitté le serveur ${guild.name}`)
  client.database.run('DELETE FROM settings WHERE guildid = ?', [guild.id]).catch(console.error)
}
