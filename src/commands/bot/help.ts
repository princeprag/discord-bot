import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const HELP_CONSTANTS = {
  title: "Bot commands",
  description: (prefix: string) =>
    `My available commands are below. The command name must be prefixed with \`${prefix}\`, just like the \`${prefix}help\` command used to get this message. For information on a specific command, please use \`${prefix}help <command>\`.`,
  footer: "I hope I could help!",
  notFound: (prefix: string, commandName: string) =>
    `I am so sorry, but I could not find the \`${prefix}${commandName}\` command. Please try \`${prefix}help\` for a list of available commands.`,
};

const help: CommandInt = {
  name: "help",
  description:
    "Provides a list of current commands to the user. Optionally provides information on the specific **command**.",
  parameters: [
    "`<?command>`: name of the command to get more information about",
  ],
  run: async (message) => {
    const { bot, channel, commandArguments, guild } = message;

    const { color, commands, prefix } = bot;

    if (!guild) {
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
        await message.reply(
          HELP_CONSTANTS.notFound(prefix[guild.id], commandName)
        );
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

    const commandNames: string[] = [];

    // Get the unique commands.
    for (const command of new Set(Object.values(commands)).values()) {
      if (command.name) {
        commandNames.push(`\`${command.name}\``);
      } else if (command.names) {
        commandNames.push(`\`${command.names.join("/")}\``);
      }
    }

    // Add the available commands.
    helpEmbed.addField("Available commands", commandNames.sort().join(" | "));

    // Add the footer.
    helpEmbed.setFooter(HELP_CONSTANTS.footer);

    // Send the embed to the current channel.
    await channel.send(helpEmbed);
  },
};

export default help;
