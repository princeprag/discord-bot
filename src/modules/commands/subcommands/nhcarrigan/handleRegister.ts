import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { MessageEmbed } from "discord.js";
import { CommandDataInt } from "../../../../interfaces/commands/CommandDataInt";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

export const handleRegister: CommandHandler = async (Becca, interaction) => {
  try {
    const target = interaction.options.getString("command");

    if (!target) {
      await interaction.editReply(Becca.responses.missing_param);
      return;
    }

    const targetCommand = Becca.commands.find((el) => el.data.name === target);

    if (!targetCommand) {
      await interaction.editReply("Cannot find that command.");
      return;
    }

    const rest = new REST({ version: "9" }).setToken(Becca.configs.token);

    const [data] = (await rest.put(
      Routes.applicationCommands(Becca.configs.id),
      {
        body: [targetCommand.data.toJSON()],
      }
    )) as CommandDataInt[];

    const confirm = new MessageEmbed();
    confirm.setTitle(`${data.name} Command Registered`);
    confirm.setDescription(data.description);

    for (const option of data.options) {
      confirm.addField(option.name, option.description, true);
    }

    await interaction.editReply({ embeds: [confirm] });
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
