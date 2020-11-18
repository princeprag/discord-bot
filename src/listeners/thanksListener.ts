import ListenerInt from "@Interfaces/ListenerInt";
import botMentionListener from "./botMentionListener";

const thanksListener: ListenerInt = {
  name: "Thanks",
  description: "Congratulates users who are thanked.",
  run: async (message) => {
    try {
      const { author, bot, channel, guild } = message;

      // Handle no guild
      if (!guild) {
        await botMentionListener.run(message);
        return;
      }

      const serverSettings = await bot.getSettings(guild.id, guild.name);

      // Confirm feature enabled for server
      const shouldThank = serverSettings.thanks === "on";

      // If disabled, call mention listener.
      if (!shouldThank) {
        await botMentionListener.run(message);
        return;
      }

      // Convert collection into array
      const mentions = message.mentions.users.map((u) => u);

      // Isn't this gorgeous?
      const thankRegex = /((?:^|\s)(?:(?:th(?:n[qx]|x)|t[xyq]|tn(?:[x]){0,2})|\w*\s*[.,]*\s*than[kx](?:[sxz]){0,2}|than[kx](?:[sxz]){0,2}(?:[uq]|y(?:ou)?)?)|grazie|arigato(?:[u]{0,1})|doumo|gracias?|spasibo|dhanyavaad(?:hamulu)?|o?brigad(?:o|a)|dziekuje|(?:re)?merci|multumesc|shukra?an|danke)\b/gi;

      // Bot ignores itself
      if (author === bot.user) {
        return;
      }

      // If no mentions, return
      if (!mentions.length) {
        return;
      }

      // If no thanks, call mention listener
      if (!thankRegex.test(message.content)) {
        await botMentionListener.run(message);
        return;
      }

      // collect phrases
      const replies: string[] = [];

      //iterate through mentions
      for (const mention of mentions) {
        if (mention === bot.user) {
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
      console.log(
        `${message.guild?.name} had the following error with the thanks listener:`
      );
      console.log(error);
    }
  },
};

export default thanksListener;
