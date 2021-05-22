import CommandInt from "../../interfaces/CommandInt";
import { artList } from "../../utils/commands/artList";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const art: CommandInt = {
  name: "art",
  description: "Returns art!",
  category: "bot",
  run: async (message) => {
    try {
      //random number
      const random = Math.floor(Math.random() * artList.length);

      //get values for random art object
      const { fileName, artName, artist, artistUrl } = artList[random];

      //create embed
      const artEmbed = new MessageEmbed();
      artEmbed.setTitle(artName);
      artEmbed.setDescription(
        `This portrait of me was done by [${artist}](${artistUrl}).`
      );

      //add local file
      artEmbed.setImage(
        `https://www.beccalyria.com/assets/art/${fileName.replace(
          /\s/g,
          "%20"
        )}`
      );

      artEmbed.setFooter("Would you like to paint my portrait too?");

      //send it!
      await message.reply(artEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "art command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default art;
