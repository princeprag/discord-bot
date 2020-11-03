import CommandInt from "@Interfaces/CommandInt";
import inuLoveList from "@Utils/commands/inuLoveList";
import { MessageEmbed } from "discord.js";

const inulove: CommandInt = {
  name: "inulove",
  description: "Generates a random pairing to discuss.",
  run: async (message) => {
    try {
      const first = Math.floor(Math.random() * inuLoveList.length);
      const second = Math.floor(Math.random() * inuLoveList.length);
      const inuLoveEmbed = new MessageEmbed()
        .setTitle("Discuss")
        .setDescription(`${inuLoveList[first]} X ${inuLoveList[second]}`);
      await message.reply(inuLoveEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the inulove command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default inulove;
