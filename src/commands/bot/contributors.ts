import CommandInt from "@Interfaces/CommandInt";
import { ContributorInt } from "@Interfaces/commands/ContributorInt";
import Axios from "axios";
import { Message, MessageEmbed } from "discord.js";

const contributors: CommandInt = {
  names: ["contributors", "contribs"],
  description: "Lists the contributors for the bot.",
  run: async (message: Message) => {
    //get the data from the file - Axios won't target the local file :(
    const data = await Axios.get(
      "https://raw.githubusercontent.com/nhcarrigan/BeccaBot/main/.all-contributorsrc"
    );
    const contributors = data.data.contributors;

    //construct initial embed
    const contribEmbed = new MessageEmbed();
    contribEmbed.setTitle("My contributors!");
    contribEmbed.setDescription(
      "I give my thanks to these many wonderful people! [Would you like to contribute too?](https://github.com/nhcarrigan/BeccaBot)"
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
  },
};

export default contributors;
