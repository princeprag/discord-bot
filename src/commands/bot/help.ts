import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const help: CommandInt = {
  name: "help",
  description:
    "Returns a list of available commands. Optionally provides information on a specific command.",
  parameters: ["`command`: name of the command to get help with"],
  category: "bot",
  run: async (Becca, message) => {
    try {
      const { content, guild } = message;
      const [, targetCommand] = content.split(" ");

      if (!guild) {
        return { success: false, content: "Unknown guild error." };
      }

      if (targetCommand) {
        const validCommand = Becca.commands.find(
          (cmd) => cmd.name === targetCommand
        );
        if (!validCommand) {
          return {
            success: false,
            content: `${targetCommand} is not one of my available spells.`,
          };
        }
        const commandHelpEmbed = new MessageEmbed();
        commandHelpEmbed.setTitle(`${targetCommand} spell`);
        commandHelpEmbed.setColor(Becca.colours.default);
        commandHelpEmbed.setDescription(validCommand.description);
        commandHelpEmbed.addField(
          "Parameters",
          validCommand.parameters.join("\n") || "This spell has no options."
        );
        commandHelpEmbed.setTimestamp();
        return { success: true, content: commandHelpEmbed };
      }

      const botCommands = Becca.commands
        .filter((cmd) => cmd.category === "bot")
        .map((cmd) => "`" + cmd.name + "`");
      const gameCommands = Becca.commands
        .filter((cmd) => cmd.category === "game")
        .map((cmd) => "`" + cmd.name + "`");
      const generalCommands = Becca.commands
        .filter((cmd) => cmd.category === "general")
        .map((cmd) => "`" + cmd.name + "`");
      const modCommands = Becca.commands
        .filter((cmd) => cmd.category === "mod")
        .map((cmd) => "`" + cmd.name + "`");
      const serverCommands = Becca.commands
        .filter((cmd) => cmd.category === "server")
        .map((cmd) => "`" + cmd.name + "`");

      const helpEmbed = new MessageEmbed();
      helpEmbed.setTitle("Available Spells");
      helpEmbed.setDescription(
        `These are my available spells. You can cast them with the ${
          Becca.prefixData[guild.id]
        } prefix, like you did with this spell. If you need further assistance, join the [support server](http://chat.nhcarrigan.com) or view [the documentation](https://www.beccalyria.com/discord-documentation).`
      );
      helpEmbed.setColor(Becca.colours.default);
      helpEmbed.addField("Bot Spells", botCommands.join(", "));
      helpEmbed.addField("Game Spells", gameCommands.join(", "));
      helpEmbed.addField("General Spells", generalCommands.join(", "));
      helpEmbed.addField("Moderation Spells", modCommands.join(", "));
      helpEmbed.addField("Server Spells", serverCommands.join(", "));
      helpEmbed.setTimestamp();

      return { success: true, content: helpEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "help command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "help", errorId) };
    }
  },
};
