import { Interaction } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { usageListener } from "../../listeners/usageListener";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const interactionCreate = async (
  Becca: BeccaInt,
  interaction: Interaction
): Promise<void> => {
  try {
    if (interaction.isCommand()) {
      const target = Becca.commands.find(
        (el) => el.data.name === interaction.commandName
      );
      if (!target) {
        interaction.reply({
          content: `That ${interaction.commandName} interaction is not valid...`,
        });
        return;
      }
      if (!interaction.guildId || !interaction.guild) {
        await interaction.reply({
          content: `I prefer my privacy. Please talk to me in a guild instead.`,
        });
        return;
      }
      const config = await getSettings(
        Becca,
        interaction.guildId,
        interaction.guild.name
      );
      if (!config) {
        await interaction.reply({
          content: "I could not find your guild record.",
        });
        return;
      }
      await target.run(Becca, interaction, config);
      await usageListener.run(Becca, interaction);
    }
  } catch (err) {
    beccaErrorHandler(Becca, "interaction create event", err);
  }
};
