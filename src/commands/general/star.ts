import CommandInt from "../../interfaces/CommandInt";
import { MessageAttachment, MessageEmbed } from "discord.js";
import StarCountModel from "../../database/models/StarModel";

const star: CommandInt = {
  name: "star",
  description:
    "Gives the **user** a gold star! Optionally provides the **reason** for giving the star.",
  parameters: [
    "`<user>`: @name of the user to give the star to",
    "`<?reason>`: reason for giving the star",
  ],
  category: "general",
  run: async (message) => {
    try {
      const {
        author,
        Becca,
        channel,
        commandArguments,
        guild,
        mentions,
      } = message;

      const { user } = Becca;

      if (!guild || !user) {
        await message.react(message.Becca.no);
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
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToStarMention = userToStarMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToStarMention !== userToStarMentioned.id) {
        await message.reply(
          `I am so sorry, but ${userToStarMentioned.toString()} is not a valid user.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to star itself.
      if (userToStarMentioned.id === author.id) {
        await message.reply(
          "I am so sorry, but you cannot give yourself a star! I still love you though."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the reason of the star.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason = "I am sorry, but the user did not provide a reason.";
      }

      let starData = await StarCountModel.findOne({ serverID: guild.id });

      if (!starData) {
        starData = await StarCountModel.create({
          serverID: guild.id,
          serverName: guild.name,
          users: [],
        });
      }

      const targetUser = starData.users.find(
        (user) => user.userID === userToStarMentioned.id
      );

      if (targetUser) {
        targetUser.stars++;
        targetUser.userName = userToStarMentioned.username;
      } else {
        starData.users.push({
          userID: userToStarMentioned.id,
          userName: userToStarMentioned.username,
          stars: 1,
        });
      }

      starData.markModified("users");
      await starData.save();

      const starTotal = targetUser ? targetUser.stars : 1;

      //create message attachment
      const attachment = [];
      attachment.push(new MessageAttachment("./img/star.png", "star.png"));

      // Send an embed message with the star to the user.
      await channel.send(
        new MessageEmbed()
          .setTitle(
            `Congratulations, ${userToStarMentioned.username}, you got a gold star!`
          )
          .setDescription(
            `${author.toString()} has given this shiny gold star to you!`
          )
          .addField("Reason", reason)
          .attachFiles(attachment)
          .setImage("attachment://star.png")
          .setFooter(`You now have ${starTotal} stars!`)
      );

      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
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
