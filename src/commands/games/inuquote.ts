import CommandInt from "@Interfaces/CommandInt";
import { inuQuoteList } from "@Utils/commands/inuQuoteList";
import { MessageEmbed } from "discord.js";

const inuquote: CommandInt = {
  name: "inuquote",
  description: "Returns an InuYasha quote",
  run: async (message) => {
    const random = Math.floor(Math.random() * inuQuoteList.length);
    const target = inuQuoteList[random];
    const quoteEmbed = new MessageEmbed()
      .setTitle("InuYasha Quote")
      .setDescription(target.quote)
      .setFooter(`--${target.author}`);
    await message.reply(quoteEmbed);
  },
};

export default inuquote;
