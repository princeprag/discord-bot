import CommandInt from "@Interfaces/CommandInt";
import { artList } from "@Utils/commands/artList";
import { MessageEmbed } from "discord.js";

const ART_CONSTANTS = {
  error: "I am so sorry, but I cannot do that at the moment.",
  title: "Art!",
  description: (artist: string, artist_url: string): string =>
    `Here is some Becca art! Art kindly done by [${artist}](${artist_url})!`,
  attachment_name: "becca.png",
  attachment_path: (file_name: string): string => `./img/${file_name}`,
};

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
      artEmbed.setTitle(ART_CONSTANTS.title);
      artEmbed.setDescription(ART_CONSTANTS.description(artist, artist_url));

      //add local file
      artEmbed.setImage(
        `https://beccalyria.nhcarrigan.com/assets/img/art/${file_name.replace(
          /\s/g,
          ""
        )}`
      );

      //send it!
      await message.reply(artEmbed);
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the art command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had this error with the art command:`
      );
      console.log(error);
      message.reply(ART_CONSTANTS.error);
    }
  },
};

export default art;
