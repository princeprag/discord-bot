import { beccaErrorHandler } from "@Utils/beccaErrorHandler";
import ListenerInt from "../interfaces/ListenerInt";

const botMentionListener: ListenerInt = {
  name: "Becca Mention Listener",
  description: "Listens for Becca being mentioned.",
  run: async (message) => {
    try {
      const { Becca, channel, guild } = message;
      if (!guild) {
        return;
      }
      if (Becca.user && message.mentions.users?.has(Becca.user.id)) {
        await message.react(Becca.think);
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
            Becca.prefix[guild.id]
          }help\` to see what I can do for you! 💜`
        );
      }
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "botMention listener",
        message.Becca.debugHook
      );
    }
  },
};

export default botMentionListener;
