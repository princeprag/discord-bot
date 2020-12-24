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

      //construct initial embed
      const contribEmbed = new MessageEmbed();
      contribEmbed.setTitle("My contributors!");
      contribEmbed.setDescription(
        "I give my thanks to these many wonderful people! [Would you like to contribute too?](https://github.com/nhcarrigan/Becca-Lyria)"
      );

      //add contributors
      contributors.forEach((cont: ContributorInt) => {
        contribEmbed.addField(
          cont.name,
          `[${cont.contributions.join(", ")}](${cont.profile})`
        );
      });

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
