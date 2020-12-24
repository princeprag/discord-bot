import CommandInt from "@Interfaces/CommandInt";
import { artList } from "@Utils/commands/artList";
import { MessageEmbed } from "discord.js";

const art: CommandInt = {
  name: "art",
  description: "Returns art!",
  run: async (message) => {
    try {
      //random number
      const random = Math.floor(Math.random() * artList.length);

      //get values for random art object
      const { file_name, art_name, artist, artist_url } = artList[random];

      //create embed
      const artEmbed = new MessageEmbed();
      artEmbed.setTitle(art_name);
      artEmbed.setDescription(
        `Art generously provided by [${artist}](${artist_url})!`
      );

      //add local file
      artEmbed.setImage(
        `https://beccalyria.nhcarrigan.com/assets/img/art/${file_name.replace(
          /\s/g,
          "%20"
        )}`
      );

      //send it!
      await message.reply(artEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the art command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had this error with the art command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that right now.");
    }
  },
};

export default art;
