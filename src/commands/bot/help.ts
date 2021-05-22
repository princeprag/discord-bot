import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const HELP_CONSTANTS = {
  title: "Becca's commands",
  description: (prefix: string) =>
    `My available spells are below. The spell name must be prefixed with \`${prefix}\`, just like the \`${prefix}help\` spell used to get this message. For information on a specific spell, use \`${prefix}help <spell>\`.`,
  footer: "Which one shall I cast next?",
  notFound: (prefix: string, commandName: string) =>
    `\`${prefix}${commandName}\` is not in my spellbook. Try \`${prefix}help\` for a list of available spells.`,
};

const help: CommandInt = {
  name: "help",
  description:
    "Provides a list of current commands to the user. Optionally provides information on the specific **command**.",
  parameters: [
    "`<?command>`: name of the command to get more information about",
  ],
  category: "bot",
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments, guild } = message;

      const { color, commands, prefix } = Becca;

      if (!guild) {
        await message.react(Becca.no);
        return;
      }

      // Get the next argument as the command name.
      const commandName = commandArguments.shift();

      // Check if the command name exists.
      if (commandName) {
        // Get the command interface for the command name.
        const command = commands[commandName];

        // Check if the command does not exist.
        if (!command) {
          await message.channel.send(
            HELP_CONSTANTS.notFound(prefix[guild.id], commandName)
          );
          await message.react(Becca.no);
          return;
        }

        // Create a new empty embed.
        const commandEmbed = new MessageEmbed();

        // Add a light purple color.
        commandEmbed.setColor(color);

        // Add the command name as the title.
        commandEmbed.setTitle(commandName);

        // Add the command description.
        commandEmbed.setDescription(command.description);

        // Check if the command has parameters.
        if (command.parameters) {
          commandEmbed.addField(
            "Parameters",
            command.parameters
              .join("\r\n")
              .replace(/{@prefix}/gi, prefix[guild.id])
          );
        }

        // Add the command usage.
        commandEmbed.addField(
          "Usage",
          `${prefix[guild.id]}${commandName}${
            command.parameters
              ? ` ${command.parameters
                  .map((el) => el.split(":")[0].replace(/`/g, ""))
                  .join(" ")}`
              : ""
          }`
        );

        // Send the embed to the current channel.
        await channel.send(commandEmbed);
        await message.react(Becca.yes);
        return;
      }

      // Create a new empty embed.
      const helpEmbed = new MessageEmbed();

      // Add a light purple color.
      helpEmbed.setColor(color);

      // Add the title.
      helpEmbed.setTitle(HELP_CONSTANTS.title);

      // Add the description.
      helpEmbed.setDescription(HELP_CONSTANTS.description(prefix[guild.id]));

      // Get commands by category
      const botCommandNames: string[] = [];
      const gameCommandNames: string[] = [];
      const generalCommandNames: string[] = [];
      const moderationCommandNames: string[] = [];
      const serverCommandNames: string[] = [];

      // Get the unique commands.
      for (const command of new Set(Object.values(commands)).values()) {
        switch (command.category) {
          case "bot":
            botCommandNames.push(`\`${command.name}\``);
            break;
          case "game":
            gameCommandNames.push(`\`${command.name}\``);
            break;
          case "general":
            generalCommandNames.push(`\`${command.name}\``);
            break;
          case "moderation":
            moderationCommandNames.push(`\`${command.name}\``);
            break;
          case "server":
            serverCommandNames.push(`\`${command.name}\``);
            break;
        }
      }

      // Add the available commands.
      helpEmbed.addField(
        "Bot-related Spells",
        botCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "Game-related Spells",
        gameCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "General Spells",
        generalCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "Moderation Spells",
        moderationCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "Server Spells",
        serverCommandNames.sort().join(" | ")
      );
      // Add the footer.
      helpEmbed.setFooter(HELP_CONSTANTS.footer);

      // Send the embed to the current channel.
      await channel.send(helpEmbed);
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "help command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default help;
