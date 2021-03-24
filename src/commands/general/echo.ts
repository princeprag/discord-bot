import { beccaErrorHandler } from "@Utils/beccaErrorHandler";
import CommandInt from "../../interfaces/CommandInt";

const echo: CommandInt = {
  name: "echo",
  description:
    "Sends the [message] to the [guild] [channel]. Restricted to Becca's owner",
  parameters: [
    "`<guild>`: the ID of the guild to send the message to",
    "`<channel>`: the ID of the channel to send the message to",
    "`<message>`: the message to send",
  ],
  category: "general",
  run: async (message) => {
    try {
      const { author, Becca, channel, commandArguments } = message;

      // Restrict to owner
      if (author.id !== process.env.OWNER_ID) {
        await message.reply(
          "I am so sorry, but I can only do this for my beloved."
        );
        await message.react(message.Becca.no);
        return;
      }

      // get guild ID
      const guildArg = commandArguments.shift();

      if (!guildArg) {
        await message.reply(
          "Would you please try the command again, and tell me the id of the guild you want to message?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // find guild
      const targetGuild = Becca.guilds.cache.find((g) => g.id === guildArg);

      if (!targetGuild) {
        await message.reply(
          "I am so sorry, but I could not find a guild with the ID of " +
            guildArg
        );
        await message.react(message.Becca.no);
        return;
      }

      // get channel ID
      const channelArg = commandArguments.shift();

      if (!channelArg) {
        await message.reply(
          "Would you please try the command again, and tell me the id of the channel you want me to message?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // find channel
      const targetChannel = targetGuild.channels.cache.find(
        (c) => c.id === channelArg
      );

      if (!targetChannel) {
        await message.reply(
          "I am so sorry, but I could not find a channel with the ID of " +
            channelArg
        );
        await message.react(message.Becca.no);
        return;
      }

      if (!targetChannel.isText()) {
        await message.reply(
          `I am so sorry, but I can only send messages to text channels, not ${targetChannel.type} channels.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // get message
      const sendMessage = commandArguments.join(" ");

      await targetChannel.send(sendMessage);
      await channel.send(
        `Okay, I have sent your message to the ${targetChannel.name} channel in ${targetGuild.name}.`
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "echo command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default echo;
