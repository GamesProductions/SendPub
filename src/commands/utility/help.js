/**
 * Provides useful information.
 * @module commands/help
 */

/**
 * Execute command
 * @param {Discord.Client} client - The Discord client
 * @param {Discord.Message} message - The message of the command
 * @param {string} args - The arguments of the command
 */
exports.run = async (client, message, args) => {
  client.embed.send(message, {
    title: 'Page d aide !',
    code: true,
    desc: `Le bot a été créé par **${client.users.cache.get(client.config.ownerID).tag}**, si vous avez des questions ou souhaitez suggérer de nouvelles fonctionnalités ou signaler des bogues, veuillez leur envoyer un message direct. Toutes les commandes commencent par \`${client.config.prefix}\`.`,
    fields: [{
      name: 'invite',
      value: 'Une façon d inviter ce bot dans votre propre serveur.'
    },
    {
      name: 'init',
      value: 'Synchronisez le canal publicitaire.'
    },
    {
      name: 'desc',
      value: 'Définissez la description de votre annonce.'
    },
    {
      name: 'preview',
      value: 'Prévisualisez votre publicité.'
    },
    {
      name: 'bump',
      value: 'Diffusez votre annonce auprès de toutes les autres serveurs.'
    },
    {
      name: 'help',
      value: 'Commande inutile.'
    }
    ]
  })
}

/** Command Config */
exports.conf = {
  enabled: true,
  aliases: ['h'],
  guildOnly: false,
  permLevel: 'User'
}

/** Command Help */
exports.help = {
  name: 'help',
  usage: '',
  description: 'Commande utile.'
}
