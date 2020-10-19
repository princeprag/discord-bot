import CommandInt from "@Interfaces/CommandInt";
import inuLoveList from "@Utils/commands/inuLoveList";
import { MessageEmbed } from "discord.js";

const inulove: CommandInt = {
  name: "inulove",
  description: "Generates a random pairing to discuss.",
  run: async (message) => {
    const first = Math.floor(Math.random() * inuLoveList.length);
    const second = Math.floor(Math.random() * inuLoveList.length);
    const inuLoveEmbed = new MessageEmbed()
      .setTitle("Discuss")
      .setDescription(`${inuLoveList[first]} X ${inuLoveList[second]}`);
    await message.reply(inuLoveEmbed);
  },
};

export default inulove;
