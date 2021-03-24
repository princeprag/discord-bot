import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const beccaCommand: CommandInt = {
  name: "becca",
  description: "Returns information about Becca's character.",
  category: "general",
  run: async (message) => {
    try {
      const { Becca, channel } = message;
      const beccaEmbed = new MessageEmbed();
      beccaEmbed.setColor(Becca.color);
      beccaEmbed.setTitle("Becca Lyria");
      beccaEmbed.setThumbnail(Becca.user?.avatarURL({ dynamic: true }) || "");

      beccaEmbed.setDescription(
        "Becca Lyria is a young female wizard. Fuelled primarily by the pursuit of knowledge, Becca travels the multiverse always searching for new things to learn. She's known for being friendly to those she meets, but always keeping them at a distance. Aside from Rosalia, Becca has no close, trusted companions. She has been seen travelling with others, but only when the situation calls for it. Becca's true age is unknown, but her physical age remains 21."
      );

      beccaEmbed.addField(
        "History",
        "Becca was an orphan, growing up in the streets of a small village. As a child, she had to struggle to survive day to day. It is partly because of this that she struggles to form deep emotional bonds with others. When she was 8, Becca had been caught by the town guard attempting to steal food. In the resulting altercation, Becca unintentionally called lightning down on a guardsman. This unexpected spurt of magical ability caught the attention of the nearest Academy, and Becca was sent there for magical training. She spent 10 years there - where she strengthened her control over lightning. During her time in the Academy, Becca also began exploring necromancy. Her professors caught wind of this and prohibited her from continuing the exploration of that field. Being denied the opportunity to pursue more knowledge, Becca became bitter and frustrated about the restrictions imposed upon her. When she came across the methods for interplanar travel, she bid her farewells and set off to continue her studies."
      );

      beccaEmbed.addField(
        "Appearance",
        "Becca has soft white hair which she keeps in pigtails, deep purple eyes, and pale skin. She wears glasses, despite not needing them, and can always be seen in purple clothing - usually a dress, but sometimes other outfits."
      );

      beccaEmbed.addField(
        "Skills and Combat",
        "Becca is a fulgramancer and necromancer - she specialises in lightning and death magic, and is capable of bringing destruction to her foes from a distance. Becca prefers to avoid close combat, and will employ stealth as needed to avoid being seen by her targets. Becca's magical prowess has granted her near-immortality. It is believed that she cannot be killed, though when she suffers what would be a fatal blow Becca must retreat to a private plane of existence. There she takes the time needed to absorb the magical energies of the planes and recover her strength. Becca will sometimes use a wand or staff to help channel her magical energies, but can work just as well when she is completely unarmed."
      );

      beccaEmbed.addField(
        "Alignment: Lawful Neutral",
        "Becca falls under the Lawful Neutral alignment. She will not go out of her way to help others, but will also not unnecessarily inflict harm (things such as theft and murder are not her methods). Becca WILL, however, do whatever is necessary to fulfil a job contract or request. Once someone has requested her services and promised payment, Becca considers that to be the establishment of a contract and will complete the task without fail. She cannot be persuaded to abandon the contract or betray the employer, regardless of any moral or ethical reasons to do so. This fierce loyalty to her clients has earned Becca a strong reputation as reliable, and she frequently sees requests for work. Becca will often turn down requests, though, should they require her to step away from her quest for learning."
      );

      await channel.send(beccaEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "becca command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default beccaCommand;
