import CommandInt from "../../interfaces/CommandInt";
import { MessageAttachment, MessageEmbed } from "discord.js";
import StarCountModel from "../../database/models/StarModel";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
      const { author, Becca, channel, commandArguments, guild, mentions } =
        message;

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
        await message.channel.send(
          "If I am going to carry this star around, you could at least tell me who to deliver it to..."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Remove the `<@!` and `>` from the mention to get the id.
      userToStarMention = userToStarMention.replace(/[<@!>]/gi, "");

      // Check if the user mention string and the first user mention id are equals.
      if (userToStarMention !== userToStarMentioned.id) {
        await message.channel.send(
          `${userToStarMentioned.toString()} does not seem to be a real person. I cannot deliver stars to your imaginary friends.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Check if trying to star itself.
      if (userToStarMentioned.id === author.id) {
        await message.channel.send(
          "It is good to have pride, but giving yourself a star is a bit much."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the reason of the star.
      let reason = commandArguments.join(" ");

      // Add a default reason if it not provided.
      if (!reason || !reason.length) {
        reason =
          "They did not say why. Let's assume you did something really impressive, though.";
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
            `${userToStarMentioned.username}, this gold star is for you.`
          )
          .setDescription(
            `${author.toString()} wants you to carry this around. Forever.`
          )
          .addField("Reason", reason)
          .attachFiles(attachment)
          .setImage("attachment://star.png")
          .setFooter(`You're now carrying ${starTotal} of these. Enjoy.`)
      );

      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "star command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default star;
