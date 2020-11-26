import CommandInt from "@Interfaces/CommandInt";
import { artList } from "@Utils/commands/artList";
import { MessageAttachment, MessageEmbed } from "discord.js";

const ART_CONSTANTS = {
  error: "I am so sorry, but I cannot do that at the moment.",
  title: "Art!",
  description: (artist: string, artist_url: string): string =>
    `Here is some Becca art! Art kindly done by [${artist}](${artist_url})!`,
  attachment_name: "becca.png",
  attachment_path: (file_name: string): string => `./img/${file_name}`,
  image: "attachment://becca.png",
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

      //local files require a bit of hacking
      const attachment = [];
      attachment.push(
        new MessageAttachment(
          ART_CONSTANTS.attachment_path(file_name),
          ART_CONSTANTS.attachment_name
        )
      );

      //add local file
      artEmbed.attachFiles(attachment);
      artEmbed.setImage(ART_CONSTANTS.image);

      //send it!
      await message.reply(artEmbed);
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
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
