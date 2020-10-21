import CommandInt from "@Interfaces/CommandInt";
import { artList } from "@Utils/commands/artList";
import { MessageAttachment, MessageEmbed } from "discord.js";

const art: CommandInt = {
  name: "art",
  description: "Returns art!",
  run: async (message) => {
    try {
      //random number
      const random = Math.floor(Math.random() * artList.length);

      //get values for random art object
      const { file_name, artist, artist_url } = artList[random];

      //create embed
      const artEmbed = new MessageEmbed();
      artEmbed.setTitle("Art!");
      artEmbed.setDescription(
        `Here is some Becca art! Art kindly done by [${artist}](${artist_url})!`
      );

      //local files require a bit of hacking
      const attachment = [];
      attachment.push(new MessageAttachment(`./img/${file_name}`, "becca.png"));

      //add local file
      artEmbed.attachFiles(attachment);
      artEmbed.setImage("attachment://becca.png");

      //send it!
      await message.reply(artEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had this error with the art command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default art;
