import CommandInt from "@Interfaces/CommandInt";
import { MessageAttachment, MessageEmbed } from "discord.js";

const star: CommandInt = {
  name: "star",
  description:
    "Gives the **user** a gold star! Optionally provides the **reason** for giving the star.",
  parameters: [
    "`<user>`: @name of the user to give the star to",
    "`<?reason>`: reason for giving the star",
  ],
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

      const { user } = bot;

      if (!guild || !user) {
        return;
      }

      // Get the next argument as the user to star mention.
      let userToStarMention = commandArguments.shift();

      // Get the first user mention.
      const userToStarMentioned = mentions.users.first();

      // Check if the user mention is valid.
      if (!userToStarMention || !userToStarMentioned || !mentions.members) {
        await message.reply(
          "Would you please try the command again, and provide the user mention that you want me to send a star to?"
        );
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToStarMention = userToStarMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToStarMention !== userToStarMentioned.id) {
        await message.reply(
          `I am so sorry, but ${userToStarMentioned.toString()} is not a valid user.`
        );
        return;
      }

      // Check if trying to star itself.
      if (userToStarMentioned.id === author.id) {
        await message.reply(
          "I am so sorry, but you cannot give yourself a star! I still love you though."
        );

        return;
      }

      // Get the reason of the star.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason = "I am sorry, but the user did not provide a reason.";
      }

      //create message attachment
      const attachment = [];
      attachment.push(new MessageAttachment("./img/star.png", "star.png"));

      // Send an embed message with the star to the user.
      await userToStarMentioned.send(
        new MessageEmbed()
          .setTitle("You got a gold star!")
          .setDescription(
            `${author.toString()} has given this shiny gold star to you!`
          )
          .addField("Reason", reason)
          .attachFiles(attachment)
          .setImage("attachment://star.png")
          .setFooter("I am so proud of you! 🙃")
      );

      // Send a success message to the current channel.
      await channel.send(
        `Okay, I sent ${userToStarMentioned.toString()} a gold star!`
      );
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the star command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the star command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default star;
