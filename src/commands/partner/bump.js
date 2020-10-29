/**
 * Bump an advertisement.
 * @module commands/bump
 */

const prettyMS = require('pretty-ms')
const lastDate = []

/**
 * Execute command
 * @param {Discord.Client} client - The Discord client
 * @param {Discord.Message} message - The message of the command
 * @param {string} args - The arguments of the command
 */
exports.run = async (client, message, args) => {
  const ignoreCooldown = false
  const now = new Date()
  const cooldown = (5 * 60 * 1000)

  if (!message.guild.me.hasPermission('CREATE_INSTANT_INVITE') || !message.guild.me.hasPermission('MANAGE_GUILD')) {
    client.embed.send(message, { desc: 'J ai besoin des autorisations `CREATE_INSTANT_INVITE` et` MANAGE_GUILD` pour bump votre serveur !.' })
    return
  }

  if (lastDate[message.guild.id] === undefined) {
    lastDate[message.guild.id] = 0
  }

  if (now - lastDate[message.guild.id] > cooldown || ignoreCooldown) {
    // It's been more than the set cooldown
    client.database.all('SELECT * FROM settings').then(async row => {
      message.guild.fetchInvites().then(async invites => {
        if (row.length - 1 <= 0) {
          client.embed.send(message, { desc: 'Il n y a pas d autres serveurs pour votre publicité, «v!invite» et configurez le bot sur d autres serveurs avant de réessayer.' })
          return
        }

        let invite

        if (invites.size > 0) {
          invite = invites.first() // Invite Exists
        } else {
          let channelID // Invite does not exist. Create one.
          const channels = message.guild.channels.cache
          for (const c of channels) {
            const channelType = c[1].type
            if (channelType === 'text') {
              channelID = c[0]
              break
            }
          }

          const channel = channels.get(message.guild.systemChannelID || channelID)
          invite = await channel.createInvite()
        }

        bumpLogic(client, message, row, invite)
        lastDate[message.guild.id] = now
      }).catch(console.error)
    })
  } else {
    // It's been less than the set cooldown.
    const remaining = prettyMS(Math.round((cooldown) - (now - lastDate[message.guild.id])), { verbose: true, unitCount: 3, secondsDecimalDigits: 0 })
    client.embed.send(message, { desc: `Vous devez attendre **${remaining}** avant de pouvoir utiliser à nouveau cette commande.` })
  }
}

function bumpLogic (client, message, row, invite) {
  for (let i = 0; i < row.length; i++) {
    const guild = client.guilds.cache.get(row[i].guildid)
    let desc = null

    for (let a = 0; a < row.length; a++) {
      const temp = client.guilds.cache.get(row[a].guildid)
      if (temp) {
        if (temp.id === message.guild.id) {
          if (!message.guild.channels.cache.has(row[a].partner)) {
            client.embed.send(message, { desc: `Vous devez d'abord initialiser un canal pour le bot dans ${message.guild.name} avec \`${client.config.prefix}init\` avant de pouvoir faire bumper votre serveur.` })
            lastDate[message.guild.id] = 0
            return
          }
          desc = row[a].desc
          break
        }
      }
    }

    if (desc === undefined || desc === null) {
      lastDate[message.guild.id] = 0
      return client.embed.send(message, { desc: `La description de ${message.guild.name} n'a pas encore été défini. Veuillez en définir un.` })
    }

    if (guild) {
      if (guild.channels.cache.has(row[i].partner) && guild.id !== message.guild.id) {
        const guildInfo = getGuildInfo(message.guild)
        guild.channels.cache.get(row[i].partner).send({
          embed: {
            title: guildInfo.name,
            description: `${desc}\n\n[Invite](${invite.url})`,
            fields: [
              {
                name: `Membres : \`${message.guild.members.cache.size}\` (\`${guildInfo.humans}%\` Humains | \`${guildInfo.bots}%\` Bots)`,
                value: `En ligne : \`${guildInfo.online}\` | Veille : \`${guildInfo.idle}\` | Ne pas deranger : \`${guildInfo.dnd}\``,
                inline: false
              },
              
              



            ],
            thumbnail: {
              url: message.guild.iconURL()
            },
            footer: {
              text: `Créé : ${message.guild.createdAt} | Region : ${message.guild.region}`
            }
          }
        })
      }
    }
  }

  client.embed.send(message, { desc: `Bumper ${row.length - 1} guilds !` })
}

function getGuildInfo (guild) {
  const members = guild.members.cache
  const emojis = guild.emojis.cache

  let online = 0
  let idle = 0
  let dnd = 0
  let humans = 0
  let bots = 0

  let humanPercent = 0
  let botPercent = 0

  const emotes = []

  members.forEach(member => {
    const status = member.presence.clientStatus
    if (!member.user.bot && status !== null) {
      humans++
      if (status.web === 'En ligne' || status.desktop === 'En ligne' || status.mobile === 'En ligne') {
        online++
      }

      if (status.web === 'Veille' || status.desktop === 'Veille' || status.mobile === 'Veille') {
        idle++
      }
      if (status.web === 'Ne pas deranger' || status.desktop === 'Ne pas deranger' || status.mobile === 'Ne pas deranger') {
        dnd++
      }
    } else {
      bots++
    }
  })

  emojis.forEach(emoji => {
    emotes.push(`${emoji.toString()}`)
  })

  humanPercent = Math.round((humans / members.size) * 100)
  botPercent = Math.round((bots / members.size) * 100)

  return {
    name: guild.name,
    online: online,
    idle: idle,
    dnd: dnd,
    humans: humanPercent,
    bots: botPercent,
    emojis: emotes
  }
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
  name: 'bump',
  usage: '',
  description: 'Bump votre publicité.'
}
