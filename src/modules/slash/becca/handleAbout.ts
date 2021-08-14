import { CommandInteraction, MessageEmbed } from "discord.js";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleAbout = async (
  Becca: BeccaInt,
  interaction: CommandInteraction
): Promise<void> => {
  try {
    const aboutEmbed = new MessageEmbed();
    aboutEmbed.setColor(Becca.colours.default);
    aboutEmbed.setTitle("Becca Lyria the Discord Bot");
    aboutEmbed.setDescription(
      "Becca was created by [nhcarrigan](https://www.nhcarrigan.com). You can [view her source code](https://github.com/beccalyria/discord-bot) or join the [official chat server](http://chat.nhcarrigan.com)."
    );
    aboutEmbed.addField(
      "Version",
      process.env.npm_package_version || "unknown version",
      true
    );
    aboutEmbed.addField("Creation date", "Sunday, 31 May 2020", true);
    aboutEmbed.addField("Guilds", Becca.guilds.cache.size.toString(), true);
    aboutEmbed.addField(
      "Available spells",
      Becca.slash.length.toString(),
      true
    );
    aboutEmbed.addField("Favourite Colour", "Purple", true);
    aboutEmbed.setFooter(
      "Now that we have introduced ourselves, it is time for an adventure."
    );

    await interaction.editReply({ embeds: [aboutEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "about command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "about", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "about", errorId)],
        })
      );
  }
};
