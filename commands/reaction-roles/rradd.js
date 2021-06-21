const Discord = require("discord.js");
const emojis = require("../../emojis.js")

module.exports = {
name: "rradd",
usage: "rradd [channel mention | channelID] [messageID] [role mention | roleID] [emoji]",
run: async (client, message, args, db) => {
if (!args[0]) return message.channel.send(`:x: | **Specify The ChannelID or mention The Channel**`);
if (!args[1]) return message.channel.send(`:x: | **Specify The messageID**`);
if (!args[2]) return message.channel.send(`:x: | **Specify The roleID or mention The Role**`);
if (!args[3]) return message.channel.send(`:x: | **Specify The emoji**`);

let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
if (!channel) return message.channel.send(`:x: | **Channel Not Found**`);
let msg = await channel.messages.fetch(args[1]);
if (!msg) return message.channel.send(`:x: | **Message Not Found**`);
let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
if (!role) return message.channel.send(`:x: | **Role Not Found**`);
let emoji = await Discord.Util.parseEmoji(args[3]);
if (!emoji && !emojis.includes(args[3])) return message.channel.send(":x: | **Specify a valid Emoji**");
if (emoji && !emojis.includes(args[3])) {
  let checking = await client.emojis.cache.find(x => x.id === emoji.id);
  if (!checking) return message.channel.send(`:x: | **Invalid Emoji**`);
};
let pog = db.get(`reactions_${message.guild.id}_${msg.id}`)
if (pog && pog.find((x) => x.emoji == args[3])) {
            let embed = new Discord.MessageEmbed()
            embed.setAuthor(message.guild.name, message.guild.iconURL())
            embed.setTitle("Error")
            embed.setDescription(`:x: | **The emoji is already being used in The message for reaction Roles!**`)
            embed.setFooter(message.author.tag + " | made by legendjs#0001", message.author.displayAvatarURL({ dynamic: true }));
            embed.setTimestamp()
            embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            return message.channel.send({
              embed: embed
            });
        }
await msg.react(args[3])
db.push(`reactions_${message.guild.id}_${msg.id}`, {
emoji: args[3],
roleId: role.id
});

let embed = new Discord.MessageEmbed()
        embed.setAuthor(message.guild.name, message.guild.iconURL())
        embed.setTitle("Success")
        embed.setThumbnail(message.guild.iconURL())
        embed.setDescription(`**The Reaction Role has been Set up**`)
        embed.setFooter(message.author.tag + " | made by legendjs#0001", message.author.displayAvatarURL({ dynamic: true }))
        embed.setColor("RANDOM")
        embed.setTimestamp()
        message.channel.send({
          embed: embed
        })
}
}
