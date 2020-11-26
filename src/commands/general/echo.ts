import CommandInt from "@Interfaces/CommandInt";

const echo: CommandInt = {
  name: "echo",
  description:
    "Sends the [message] to the [guild] [channel]. Restricted to bot owner",
  parameters: [
    "`<guild>` - the ID of the guild to send the message to",
    "`<channel>` - the ID of the channel to send the message to",
    "`<message>` - the message to send",
  ],
  run: async (message) => {
    try {
      const { author, bot, channel, commandArguments } = message;

      // Restrict to owner
      if (author.id !== process.env.OWNER_ID) {
        await message.reply(
          "I am so sorry, but I can only do this for my beloved."
        );
        return;
      }

      // get guild ID
      const guildArg = commandArguments.shift();

      if (!guildArg) {
        await message.reply(
          "Would you please try the command again, and tell me the id of the guild you want to message?"
        );
        return;
      }

      // find guild
      const targetGuild = bot.guilds.cache.find((g) => g.id === guildArg);

      if (!targetGuild) {
        await message.reply(
          "I am so sorry, but I could not find a guild with the ID of " +
            guildArg
        );
        return;
      }

      // get channel ID
      const channelArg = commandArguments.shift();

      if (!channelArg) {
        await message.reply(
          "Would you please try the command again, and tell me the id of the channel you want me to message?"
        );
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
        return;
      }

      if (!targetChannel.isText()) {
        await message.reply(
          `I am so sorry, but I can only send messages to text channels, not ${targetChannel.type} channels.`
        );
        return;
      }

      // get message
      const sendMessage = commandArguments.join(" ");

      await targetChannel.send(sendMessage);
      await channel.send(
        `Okay, I have sent your message to the ${targetChannel.name} channel in ${targetGuild.name}.`
      );
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the echo command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the echo command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default echo;
