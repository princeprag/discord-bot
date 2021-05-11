import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import ListenerInt from "../interfaces/ListenerInt";
import botMentionListener from "./botMentionListener";

const thanksListener: ListenerInt = {
  name: "Thanks",
  description: "Congratulates users who are thanked.",
  run: async (message, config) => {
    try {
      const { author, Becca, channel, guild } = message;

      // Handle no guild
      if (!guild) {
        await botMentionListener.run(message, config);
        return;
      }

      // Confirm feature enabled for server
      const shouldThank = config.thanks === "on";

      // If disabled, call mention listener.
      if (!shouldThank) {
        await botMentionListener.run(message, config);
        return;
      }

      // Convert collection into array
      const mentions = message.mentions.users.map((u) => u);

      // Isn't this gorgeous?
      const thankRegex =
        /((?:^|\s)(?:(?:th(?:n[qx]|x)|t[xyq]|tn(?:[x]){0,2})|\w*\s*[.,]*\s*than[kx](?:[sxz]){0,2}|than[kx](?:[sxz]){0,2}(?:[uq]|y(?:ou)?)?)|grazie|arigato(?:[u]{0,1})|doumo|gracias?|spasibo|dhanyavaad(?:hamulu)?|o?brigad(?:o|a)|dziekuje|(?:re)?merci|multumesc|shukra?an|danke)\b/gi;

      // Becca ignores herself
      if (author === Becca.user) {
        return;
      }

      // If no mentions, return
      if (!mentions.length) {
        return;
      }

      // If no thanks, call mention listener
      if (!thankRegex.test(message.content)) {
        await botMentionListener.run(message, config);
        return;
      }

      // collect phrases
      const replies: string[] = [];

      //iterate through mentions
      for (const mention of mentions) {
        if (mention === Becca.user) {
          replies.push(`Aww, you're welcome! I am very glad I could help!`);
          continue;
        }
        if (mention === author) {
          replies.push("Thanking yourself seems a bit weird...");
          continue;
        }
        replies.push(`Nice work <@!${mention.id}>! Thank you for helping!`);
      }
      //send single message with replies
      channel.startTyping();
      await message.sleep(3000);
      channel.stopTyping();
      await channel.send(replies.join(`\n`));
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "thanks listener",
        message.Becca.debugHook
      );
    }
  },
};

export default thanksListener;
