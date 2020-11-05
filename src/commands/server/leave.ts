import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const leave: CommandInt = {
  name: "leave",
  description:
    "Can tell the bot to leave a specific server. Gives a list of servers the bot is in. Pass the ID of the target server as the parameter to leave that server. This command is specific to nhcarrigan.",
  parameters: ["<?serverID>: the ID of the server to leave"],
  run: async (message) => {
    try {
      const { author, bot, channel, commandArguments } = message;

      const { guilds } = bot;

      // Check if the author id is not the owner id.
      if (author.id !== process.env.OWNER_ID) {
        await message.reply(
          "I am so sorry, but I can only do this for nhcarrigan."
        );

        return;
      }

      // Get the next argument as the server id.
      const serverID = commandArguments.shift();

      // Check if the server id is empty - return list of servers.
      if (!serverID || !serverID.length) {
        let pageCount = 0;
        let serverList: string[] = [],
          ownerList: string[] = [];
        let serverCount = 0;
        const ownerIds: string[] = [];
        const servers = guilds.cache.map((el) => el);
        const length = servers.length;
        for (let i = 0; i < length; i++) {
          const guild = servers[i];
          serverList.push(`${guild.name} (${guild.id})`);
          ownerList.push(`${guild.owner?.user.username} (${guild.ownerID})`);
          serverCount++;
          ownerIds.push(guild.ownerID);
          if (serverList.length === 10 || ownerList.length === 10) {
            const serverEmbed = new MessageEmbed()
              .setTitle(`Server List part ${++pageCount}`)
              .setColor(bot.color);
            for (let i = 0; i < serverList.length; i++) {
              serverEmbed.addField(serverList[i], ownerList[i]);
            }
            await channel.send(serverEmbed);
            serverList = [];
            ownerList = [];
          }
        }
        const ownerCount = new Set(ownerIds).size;
        if (!serverList.length || !ownerList.length) {
          await channel.send(
            `I am in ${serverCount} servers, with ${ownerCount} unique owners.`
          );
          return;
        }
        const serverEmbed = new MessageEmbed()
          .setTitle(`Server List part ${++pageCount}`)
          .setColor(bot.color);
        for (let i = 0; i < serverList.length; i++) {
          serverEmbed.addField(serverList[i], ownerList[i]);
        }
        await channel.send(serverEmbed);
        await channel.send(
          `I am in ${serverCount} servers, with ${ownerCount} unique owner${
            ownerCount === 1 ? "s" : ""
          }.`
        );
        return;
      }

      // Get the target guild.
      const targetGuild = guilds.cache.get(serverID);

      // Check if the target guild is not valid.
      if (!targetGuild) {
        await message.reply(
          `I am so sorry, but \`${serverID}\` is not a valid server ID.`
        );

        return;
      }

      // Leave the target guild.
      await targetGuild.leave();
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the leave command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default leave;
