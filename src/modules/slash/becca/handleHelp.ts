import { CommandInteraction, MessageEmbed } from "discord.js";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleHelp = async (
  Becca: BeccaInt,
  interaction: CommandInteraction
): Promise<void> => {
  try {
    const helpEmbed = new MessageEmbed();
    helpEmbed.setTitle("How to Interact with Becca");
    helpEmbed.setDescription(
      "Hello there! I have many spells I can cast. To see the spells, type `/` and select my section from the pop-up menu."
    );
    helpEmbed.addField(
      "Support Server",
      "If you need some extra guidance, [join my support server](https://chat.nhcarrigan.com) where my minions will be glad to serve you."
    );
    helpEmbed.addField(
      "Documentation",
      "As an alternative, you are welcome to view my [instruction manual](https://www.beccalyria.com/discord-documentation) to see what I can do."
    );
    helpEmbed.addField(
      "Source Code",
      "Should you be feeling extra ambitious, you can also dive in to my [spellbook](https://github.com/BeccaLyria/discord-bot) and look at my abilities yourself."
    );
    helpEmbed.addField(
      "Migration",
      "A temporary note: We are in the process of migrating to slash commands. As we proceed, additional commands will become available. For the other commands, you can use `becca!help` to see what is available."
    );
    await interaction.editReply({ embeds: [helpEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "ping command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "ping", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "ping", errorId)],
        })
      );
  }
};
