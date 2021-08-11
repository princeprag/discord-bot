import { MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

export const schedule: CommandInt = {
  name: "schedule",
  description: "Schedule a message to be sent at a later time.",
  parameters: [
    "<time> - time to send post (in minutes)",
    "<channel> - channel to send post",
    "<...message> - message to send",
  ],
  category: "general",
  run: async (Becca, message) => {
    try {
      const { author, content, guild, member } = message;

      const [, time, channel, ...text] = content.split(" ");

      const parsedChannel = channel.replace(/\D/g, "");

      const targetChannel = await guild?.channels.fetch(parsedChannel);

      if (
        !parsedChannel ||
        !targetChannel ||
        !["GUILD_TEXT", "GUILD_NEWS"].includes(targetChannel.type)
      ) {
        return {
          success: false,
          content: `I could not find your <#${parsedChannel}> text channel`,
        };
      }

      if (!member?.permissionsIn(targetChannel).has("SEND_MESSAGES")) {
        return {
          success: false,
          content: "You are not allowed to send messages in that channel.",
        };
      }

      const parsedTime = parseInt(time, 10);

      if (isNaN(parsedTime) || parsedTime < 1) {
        return {
          success: false,
          content: `${time} is not a valid number of minutes.`,
        };
      }

      if (parsedTime > 1440) {
        return {
          success: false,
          content: `My memory is not good enough to remember this. You can only schedule a post a maximum of 1440 minutes away.`,
        };
      }

      const messageToSend =
        customSubstring(text.join(" "), 1900) ||
        "You did not tell me what to send...";

      setTimeout(
        async () =>
          await (targetChannel as TextChannel | NewsChannel).send(
            `<@!${author.id}>, here is your scheduled post:\n${messageToSend}`
          ),
        parsedTime * 60000
      );

      const successEmbed = new MessageEmbed();
      successEmbed.setTitle("Message Scheduled");
      successEmbed.setDescription(
        "I will send your message with the following settings. Please note that my memory is not perfect, and if I need to be restarted your scheduled post will be lost."
      );
      successEmbed.setColor(Becca.colours.default);
      successEmbed.addField("Time", `${parsedTime} minutes`, true);
      successEmbed.addField("Target Channel", `<#${parsedChannel}>`, true);
      successEmbed.addField("Message", messageToSend);

      return {
        success: true,
        content: successEmbed,
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "schedule command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "schedule", errorId),
      };
    }
  },
};
