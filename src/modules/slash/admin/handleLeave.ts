import { SlashHandlerType } from "../../../interfaces/slash/SlashHandlerType";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../commands/errorEmbedGenerator";

export const handleLeave: SlashHandlerType = async (Becca, interaction) => {
  try {
    const serverId = interaction.options.getString("server-id");

    if (!serverId) {
      await interaction.editReply({
        content: "How did you manage to forget the server id?",
      });
      return;
    }
    const targetServer = Becca.guilds.cache.get(`${BigInt(serverId)}`);

    if (!targetServer) {
      await interaction.editReply({
        content: `${serverId} is not a guild I recognise.`,
      });
      return;
    }

    await targetServer.leave();
    await interaction.editReply({
      content: "I have cut all ties with that group.",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "leave command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "leave", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "leaves", errorId)],
        })
      );
  }
};
