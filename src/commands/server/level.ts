import CommandInt from "@Interfaces/CommandInt";
import UserModel from "@Models/UserModel";
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

      // Get the user info from the database.
      const userInfo = await UserModel.findOne({
        server_id: guild.id,
        user_id,
      });

      // Check if the user info does not exist.
      if (!userInfo) {
        await message.reply(
          "I am so sorry, but I have no record of that user. Please encourage them to talk!"
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

      // Add the user experiencie.
      levelEmbed.addField("Experience points", userInfo.points, true);

      // Add the user level.
      levelEmbed.addField("Level", ~~(userInfo.points / 100), true);

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
