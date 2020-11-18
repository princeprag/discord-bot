import CommandInt from "@Interfaces/CommandInt";
import LevelModel from "@Models/LevelModel";
import { MessageEmbed } from "discord.js";

const level: CommandInt = {
  name: "level",
  description:
    "Gets the user's current level. Optionally pass a **user** mention to get the record for another user.",
  parameters: ["`<?user>`: the user to fetch the data for."],
  run: async (message) => {
    try {
      const {
        author,
        bot,
        channel,
        commandArguments,
        guild,
        mentions,
      } = message;

      if (!guild) {
        return;
      }

      // Set the author id as the default user id.
      let user_id = author.id;

      // Set the author username as the default username.
      let username = author.username;

      // Get the next argument as the user mention string.
      let userToStr = commandArguments.shift();

      // Get the first user mention.
      const userTo = mentions.users.first();

      // Check if has an user mention.
      if (userToStr && userTo) {
        // Remove the `<@!` and `>` from the mention to get the id.
        userToStr = userToStr.replace(/[<@!>]/gi, "");

        if (userToStr !== userTo.id) {
          await message.reply(
            `I am so sorry, but ${userToStr} is not a valid user.`
          );
          return;
        }

        user_id = userTo.id;
        username = userTo.username;
      }

      // Get the server info from the database.
      const server = await LevelModel.findOne({
        serverID: guild.id,
      });

      // Check if the server info does not exist.
      if (!server) {
        await message.reply(
          "I am so sorry, but I have no record of that server."
        );
        return;
      }

      // get the user ID from the server
      const user = server.users.find((u) => u.userID === user_id);

      // Check if no user
      if (!user) {
        await message.reply(
          `I am so sorry, but I have no record of <@!${user_id}>. Please encourage them to interact more!`
        );
        return;
      }

      // Create a new empty embed.
      const levelEmbed = new MessageEmbed();

      // Add the light purple color.
      levelEmbed.setColor(bot.color);

      // Add the title.
      levelEmbed.setTitle(`${username}'s ranking`);

      // Add the description.
      levelEmbed.setDescription(
        `Here is the record I have for you in \`${guild.name}!\``
      );

      // Add the user experience.
      levelEmbed.addField("Experience points", user.points, true);

      // Add the user level.
      levelEmbed.addField("Level", ~~(user.points / 100), true);

      // Add the time they were last seen
      levelEmbed.addField(
        "Last Seen",
        `I last saw them on ${user.lastSeen.toLocaleDateString()}`
      );

      // Send the embed to the current channel.
      await channel.send(levelEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the level command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default level;
