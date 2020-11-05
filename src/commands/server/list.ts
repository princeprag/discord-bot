import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const list: CommandInt = {
  name: "list",
  description: "Returns a list of servers the bot is in.",
  run: async (message) => {
    try {
      //extract values
      const { bot, channel } = message;
      const { guilds } = bot;

      // counting variables
      let pageCount = 0;
      let serverList: string[] = [],
        ownerList: string[] = [];
      let serverCount = 0;
      const ownerIds: string[] = [];

      //map Collection into Array
      const servers = guilds.cache.map((el) => el);

      //set length to variable to avoid recounting
      const length = servers.length;

      // loop through guilds bot is in;
      for (let i = 0; i < length; i++) {
        //assign for less typing
        const guild = servers[i];

        //push server + owner information
        serverList.push(`${guild.name} (${guild.id})`);
        ownerList.push(`${guild.owner?.user.username} (${guild.ownerID})`);

        //keep count of servers
        serverCount++;

        //push owner ID to array
        ownerIds.push(guild.ownerID);

        // check for 10 servers, send embed (to avoid hitting limits)
        if (serverList.length === 10 || ownerList.length === 10) {
          const serverEmbed = new MessageEmbed()
            .setTitle(`Server List part ${++pageCount}`)
            .setColor(bot.color);
          for (let i = 0; i < serverList.length; i++) {
            serverEmbed.addField(serverList[i], ownerList[i]);
          }
          await channel.send(serverEmbed);

          //reset string arrays
          serverList = [];
          ownerList = [];
        }
      }
      //use Set to get list of unique owners
      const ownerCount = new Set(ownerIds).size;

      //catch for even multiples of 10 - can't send empty embed
      if (!serverList.length || !ownerList.length) {
        await channel.send(
          `I am in ${serverCount} servers, with ${ownerCount} unique owner${
            ownerCount === 1 ? "s" : ""
          }.`
        );
        return;
      }

      //send embed with remaining servers < x*10
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
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the leave command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default list;
