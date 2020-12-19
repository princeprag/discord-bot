import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const beccaCommand: CommandInt = {
  name: "becca",
  description: "Returns information about Becca's character.",
  run: async (message) => {
    try {
      const { Becca, channel } = message;
      const beccaEmbed = new MessageEmbed();
      beccaEmbed.setColor(Becca.color);
      beccaEmbed.setTitle("Becca Lyria");
      beccaEmbed.setThumbnail(Becca.user?.avatarURL({ dynamic: true }) || "");

      beccaEmbed.setDescription(
        "Becca Lyria is a young female wizard. Fuelled primarily by the pursuit of knowledge, Becca travels the multiverse always searching for new things to learn. She's known for being friendly to those she meets, but always keeping them at a distance. Aside from Rosalia, Becca has no close, trusted companions. She has been seen travelling with others, but only when the situation calls for it."
      );

      beccaEmbed.addField(
        "Appearance",
        "Becca has soft white hair which she keeps in pigtails, deep purple eyes, and pale skin. She wears glasses, despite not needing them, and can always be seen in purple clothing - usually a dress, but sometimes other outfits."
      );

      beccaEmbed.addField(
        "Combat",
        "Becca is a fulgramancer and necromancer - she specialises in lightning and death magic, and is capable of bringing destruction to her foes from a distance. Becca prefers to avoid close combat, and will employ stealth as needed to avoid being seen by her targets."
      );

      beccaEmbed.addField(
        "Alignment: Lawful Neutral",
        "Becca falls under the Lawful Neutral alignment. She will not go out of her way to help others, but will also not unnecessarily inflict harm (things such as theft and murder are not her methods). Becca WILL, however, do whatever is necessary to fulfil a job contract or request. Once someone has requested her services and promised payment, Becca considers that to be the establishment of a contract and will complete the task without fail. She cannot be persuaded to abandon the contract or betray the employer, regardless of any moral or ethical reasons to do so."
      );

      await channel.send(beccaEmbed);
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the becca command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the becca command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default beccaCommand;
