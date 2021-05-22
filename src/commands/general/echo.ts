import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
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
        await message.channel.send(
          "You are not nhcarrigan, so I will not use this ability for you."
        );
        await message.react(message.Becca.no);
        return;
      }

      // get guild ID
      const guildArg = commandArguments.shift();

      if (!guildArg) {
        await message.channel.send(
          "What guild ID do you want me to send this to?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // find guild
      const targetGuild = Becca.guilds.cache.find((g) => g.id === guildArg);

      if (!targetGuild) {
        await message.channel.send(
          "Hmm... it seems I do not have access to guild " + guildArg
        );
        await message.react(message.Becca.no);
        return;
      }

      // get channel ID
      const channelArg = commandArguments.shift();

      if (!channelArg) {
        await message.channel.send(
          "What channel ID do you want me to send this to?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // find channel
      const targetChannel = targetGuild.channels.cache.find(
        (c) => c.id === channelArg
      );

      if (!targetChannel) {
        await message.channel.send(
          "Hmm... it seems I do not have access to channel " + channelArg
        );
        await message.react(message.Becca.no);
        return;
      }

      if (!targetChannel.isText()) {
        await message.channel.send(
          `${targetChannel.type} channels do not accept letters. How am I supposed to send your message there?`
        );
        await message.react(message.Becca.no);
        return;
      }

      // get message
      const sendMessage = commandArguments.join(" ");

      await targetChannel.send(sendMessage);
      await channel.send(
        `I have sent your message to the ${targetChannel.name} channel in ${targetGuild.name}.`
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
