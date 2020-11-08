import CommandInt from "@Interfaces/CommandInt";
import { inuQuoteList } from "@Utils/commands/inuQuoteList";
import { MessageEmbed } from "discord.js";

const inuquote: CommandInt = {
  name: "inuquote",
  description: "Returns an InuYasha quote",
  run: async (message) => {
    try {
      const random = Math.floor(Math.random() * inuQuoteList.length);
      const target = inuQuoteList[random];
      const quoteEmbed = new MessageEmbed()
        .setTitle("InuYasha Quote")
        .setDescription(target.quote)
        .setFooter(`--${target.author}`);
      await message.reply(quoteEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the inuquote command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default inuquote;
