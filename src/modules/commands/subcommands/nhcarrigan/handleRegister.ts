import { MessageEmbed } from "discord.js";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { registerCommands } from "../../../../utils/registerCommands";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

export const handleRegister: CommandHandler = async (Becca, interaction) => {
  try {
    const valid = await registerCommands(Becca);

    if (!valid) {
      await interaction.editReply("Failed to register commands!");
      return;
    }
    const confirm = new MessageEmbed();
    confirm.setTitle(`Commands Registered`);
    confirm.setDescription("The following commands have been registered.");

    for (const command of Becca.commands) {
      confirm.addField(command.data.name, command.data.description, true);
    }

    await interaction.editReply({ embeds: [confirm] });
    await Becca.debugHook.send(
      `Hey <@!${Becca.configs.ownerId}>, slash commands were registered.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "list command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "list", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "list", errorId)],
        })
      );
  }
};
