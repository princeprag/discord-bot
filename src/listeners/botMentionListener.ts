import ListenerInt from "@Interfaces/ListenerInt";

const botMentionListener: ListenerInt = {
  name: "Becca Mention Listener",
  description: "Listens for the bot being mentioned.",
  run: async (message) => {
    try {
      const { bot, channel, guild } = message;
      if (!guild) {
        return;
      }
      if (bot.user && message.mentions.users?.has(bot.user.id)) {
        if (message.author.id === process.env.OWNER_ID) {
          channel.startTyping();
          await message.sleep(3000);
          channel.stopTyping();
          await message.channel.send(
            "Hello, love! What can I do for you today?"
          );
          return;
        }
        channel.startTyping();
        await message.sleep(3000);
        channel.stopTyping();
        await message.channel.send(
          `Hello! Was there something I could help you with? Try \`${
            bot.prefix[guild.id]
          }help\` to see what I can do for you! 💜`
        );
      }
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the Becca Mentions listener. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the Becca Mentions listener:`
      );
      console.log(error);
    }
  },
};

export default botMentionListener;
