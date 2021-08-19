import { MessageEmbed } from "discord.js";
import { SlashHandlerType } from "../../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleHelp: SlashHandlerType = async (Becca, interaction) => {
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
      "Bug Report",
      "Have I failed you in some way? You can [report an issue](https://github.com/BeccaLyria/discord-bot/issues/choose), or let us know in the support server."
    );
    helpEmbed.addField(
      "Privacy Policy",
      "As part of my services, I collect and use some specific Discord related information. This information includes, but may not be limited to, your user name, nickname, this server's name, and your Discord ID. [View my full policy](https://github.com/BeccaLyria/discord-bot/blob/main/PRIVACY.md)"
    );
    helpEmbed.addField(
      "Migration",
      "A temporary note: We are in the process of migrating to slash commands. As we proceed, additional commands will become available. For the other commands, you can use `becca!help` to see what is available."
    );
    await interaction.editReply({ embeds: [helpEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "help command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "help", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "help", errorId)],
        })
      );
  }
};
