import CommandInt from "@Interfaces/CommandInt";
import { MessageAttachment, MessageEmbed } from "discord.js";

const art: CommandInt = {
  name: "art",
  description: "Returns art!",
  run: async (message) => {
    const random = Math.floor(Math.random() * 5).toString();
    const artEmbed = new MessageEmbed();
    artEmbed.setTitle("Art!");
    artEmbed.setDescription(
      "Here is some Becca art! Art kindly done by [Moonlight](https://www.instagram.com/moonlightkcreations/)!"
    );
    const attachment = [];
    attachment.push(
      new MessageAttachment(`./img/Becca${random}.png`, "becca.png")
    );
    artEmbed.attachFiles(attachment);
    artEmbed.setImage("attachment://becca.png");
    await message.reply(artEmbed);
  },
};

export default art;
