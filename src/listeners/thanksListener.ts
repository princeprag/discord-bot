import ListenerInt from "@Interfaces/ListenerInt";
import ToggleModel from "@Models/ToggleModel";
import botMentionListener from "./botMentionListener";

const thanksListener: ListenerInt = {
  name: "Thanks",
  description: "Congratulates users who are thanked.",
  run: async (message) => {
    try {
      const { author, bot, channel, guild } = message;

      if (!guild) {
        await botMentionListener.run(message);
        return;
      }

      const shouldThank = await ToggleModel.findOne({
        server_id: guild.id,
        key: "thanks",
      });

      if (!shouldThank?.value) {
        await botMentionListener.run(message);
        return;
      }

      const mention = message.mentions.users?.first();
      const thankRegex = /((?:^|\s)(?:(?:th(?:n[qx]|x)|t[xyq]|tn(?:[x]){0,2})|\w*\s*[.,]*\s*than[kx](?:[sxz]){0,2}|than[kx](?:[sxz]){0,2}(?:[uq]|y(?:ou)?)?)|grazie|arigato(?:[u]{0,1})|doumo|gracias?|spasibo|dhanyavaad(?:hamulu)?|o?brigad(?:o|a)|dziekuje|(?:re)?merci|multumesc|shukra?an|danke)\b/gi;
      if (author === bot.user) {
        return;
      }
      if (!mention) {
        return;
      }
      if (!thankRegex.test(message.content)) {
        await botMentionListener.run(message);
        return;
      }
      if (mention === bot.user) {
        channel.startTyping();
        await message.sleep(3000);
        channel.stopTyping();
        await channel.send(`Aww, you're welcome! I am very glad I could help!`);
        return;
      }
      if (mention === author) {
        channel.startTyping();
        await message.sleep(3000);
        channel.stopTyping();
        await channel.send("Thanking yourself seems a bit weird...");
        return;
      }
      channel.startTyping();
      await message.sleep(3000);
      channel.stopTyping();
      await channel.send(
        `Nice work <@!${mention.id}>! Thank you for helping <@!${author.id}>!`
      );
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the thanks listener:`
      );
      console.log(error);
    }
  },
};

export default thanksListener;
