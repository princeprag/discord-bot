import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const star: CommandInt = {
  name: "star",
  description:
    "Gives the **user** a gold star! Optionally provides the **reason** for giving the star.",
  parameters: [
    "`<user>`: @name of the user to give the star to",
    "`<?reason>`: reason for giving the star",
  ],
  run: async (message) => {
    const { author, bot, channel, commandArguments, guild, mentions } = message;

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
      await message.reply("you must mention an user to star.");
      return;
    }

    // Remove the `<@!` and `>` from the mention to get the id.
    userToStarMention = userToStarMention.replace(/[<@!>]/gi, "");

    // Check if the user mention string and the first user mention id are equals.
    if (userToStarMention !== userToStarMentioned.id) {
      await message.reply("the user mentioned is not valid.");
      return;
    }

    // Check if trying to star itself.
    if (userToStarMentioned.id === author.id) {
      await message.reply(
        "sorry, but you cannot give yourself a star! I still love you though."
      );

      return;
    }

    // Get the reason of the star.
    let reason = commandArguments.join(" ");

    // Add a default reason if it not provided.
    if (!reason || !reason.length) {
      reason = "Sorry, but the user did not give a reason.";
    }

    // Send an embed message with the star to the user.
    await userToStarMentioned.send(
      new MessageEmbed()
        .setTitle("You got a gold star!")
        .setDescription(
          `${author.toString()} has given this shiny gold star to you!`
        )
        .addField("Reason", reason)
        .setImage(
          "https://github.com/nhcarrigan/discord-bot/blob/master/img/star.png?raw=true"
        )
        .setFooter("I am so proud of you! 🙃")
    );

    // Send a success message to the current channel.
    await channel.send(
      `Okay, I sent to ${userToStarMentioned.toString()} a gold star!`
    );
  },
};

export default star;
