import CommandInt from "@Interfaces/CommandInt";
import { ContributorInt } from "@Interfaces/commands/ContributorInt";
import Axios from "axios";
import { MessageEmbed } from "discord.js";

const contributors: CommandInt = {
  name: "contributors",
  description: "Lists the contributors for Becca.",
  run: async (message) => {
    try {
      //get the data from the file - Axios won't target the local file :(
      const data = await Axios.get(
        "https://raw.githubusercontent.com/nhcarrigan/Becca-Lyria/main/.all-contributorsrc"
      );
      const contributors = data.data.contributors;
      // mappping list for contributor names
      const contributorName = (cont: ContributorInt) => cont.name;
      //construct initial embed
      const contribEmbed = new MessageEmbed();
      contribEmbed.setTitle("Thanks to these wonderful contributors:");
      contribEmbed.setDescription(contributors.map(contributorName).join(", "));
      //add contributors
      contribEmbed.setFooter("https://github.com/nhcarrigan/Becca-Lyria");
      contribEmbed.setColor(message.Becca.color);

      //send it!
      await message.reply(contribEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the contributors command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the contributors command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default contributors;
