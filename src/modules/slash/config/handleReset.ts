import { SettingsTypes } from "../../../interfaces/settings/SettingsTypes";
import { SlashHandlerType } from "../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";
import { resetSetting } from "../../settings/resetSetting";

export const handleReset: SlashHandlerType = async (
  Becca,
  interaction,
  config
) => {
  try {
    const { guild } = interaction;

    if (!guild) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    const setting = interaction.options.getString("setting");
    const success = await resetSetting(
      Becca,
      guild.id,
      guild.name,
      setting as SettingsTypes,
      config
    );
    await interaction.editReply(
      success
        ? `I have reset your ${setting} setting.`
        : "I am having trouble updating your settings. Please try again later."
    );
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "reset", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "reset", errorId)],
        })
      );
  }
};
