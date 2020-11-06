import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const list: CommandInt = {
  name: "list",
  description: "Returns a list of servers the bot is in.",
  parameters: ["<?page> - Page of the servers list."],
  run: async (message) => {
    try {
      //extract values
      const { bot, channel, commandArguments } = message;
      const { guilds } = bot;

      // Get the first argument as the page.
      const pageStr = commandArguments.shift();

      // Set the current page to 1.
      let currentPage = 1;

      // Check if the first argument has a value.
      if (pageStr) {
        // Set the new current page.
        currentPage = Number(pageStr);
      }

      // counting variables
      const serverList: string[] = [],
        ownerList: string[] = [];
      const ownerIds: string[] = [];

      //map Collection into Array
      const servers = guilds.cache.map((el) => el);

      //set length to variable to avoid recounting
      const length = servers.length;

      // loop through guilds bot is in;
      for (let i = 0; i < length; i++) {
        // Assign for less typing
        const guild = servers[i];

        // Push server + owner information
        serverList.push(`${guild.name} (${guild.id})`);

        // Check if the server owner exists.
        if (guild.owner) {
          // Check if the server owner has partial information.
          if (guild.owner.partial) {
            // Fetch the server owner data.
            await guild.owner.fetch();
          }

          ownerList.push(`${guild.owner.user.username} (${guild.ownerID})`);
        } else {
          const targetUser = await bot.users.fetch(guild.ownerID);
          ownerList.push(`${targetUser.username} (${guild.ownerID})`);
        }

        //push owner ID to array
        ownerIds.push(guild.ownerID);
      }

      if (serverList.length !== ownerList.length) {
        return;
      }

      const serversPerPage = 10;
      const totalPages = ~~(serverList.length / serversPerPage) + 1;

      // Check if the current page is valid.
      if (isNaN(currentPage) || currentPage <= 0 || currentPage > totalPages) {
        await message.reply("I am so sorry, but I cannot look at that page.");
        return;
      }

      const serverEmbed = new MessageEmbed()
        .setTitle(`Server List part ${currentPage}`)
        .setColor(bot.color);

      const pageCount = ~~(currentPage * serversPerPage);

      const serverPage = serverList.slice(
        pageCount - serversPerPage,
        pageCount
      );
      const ownerPage = ownerList.slice(pageCount - serversPerPage, pageCount);

      serverPage.forEach((server, i) => {
        serverEmbed.addField(
          `${pageCount - serversPerPage + i + 1}. ${server}`,
          ownerPage[i]
        );
      });

      serverEmbed.setFooter(`Page ${currentPage} of ${totalPages}`);

      //use Set to get list of unique owners
      const ownerCount = new Set(ownerIds).size;

      await channel.send(serverEmbed);

      await channel.send(
        `I am in ${serverList.length} servers, with ${ownerCount} unique owner${
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
