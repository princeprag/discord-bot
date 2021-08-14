import { CommandInteraction, MessageEmbed, Role } from "discord.js";
import { ServerModelInt } from "../../../database/models/ServerModel";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleRole = async (
  Becca: BeccaInt,
  interaction: CommandInteraction,
  config: ServerModelInt
): Promise<void> => {
  try {
    const { guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({
        content: "I cannot seem to find your guild record.",
      });
      return;
    }

    const targetRole = interaction.options.getRole("role");

    if (!targetRole) {
      const roleList = new MessageEmbed();
      roleList.setColor(Becca.colours.default);
      roleList.setTitle("Available Charms");
      roleList.setDescription(
        "These are the charms I can enchant you with: \n" +
          config.self_roles.map((el) => `<@&${el}>`).join("\n")
      );
      await interaction.editReply({ embeds: [roleList] });
      return;
    }

    if (!config.self_roles.includes(targetRole.id)) {
      await interaction.editReply({
        content:
          "I cannot cast that enchantment. You will need to speak to someone higher up.",
      });
      return;
    }

    if (Array.isArray(member.roles)) {
      await interaction.editReply({
        content: "Something is wrong with your role data...",
      });
      return;
    }

    if (member.roles.cache.has(targetRole.id)) {
      await member.roles.remove(targetRole as Role);
      await interaction.editReply({
        content: `You are no longer enchanted with \`${targetRole.name}\`.`,
      });
      return;
    }
    await member.roles.add(targetRole as Role);
    await interaction.editReply({
      content: `I have cast the \`${targetRole.name}\` charm on you.`,
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "role command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "role", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "role", errorId)],
        })
      );
  }
};
