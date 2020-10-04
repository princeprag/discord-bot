import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const help: CommandInt = {
  name: "help",
  description:
    "Provides a list of current commands to the user. Optionally provides information on the specific **command**.",
  parameters: [
    "`<?command>`: name of the command to get more information about",
  ],
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

    const { color, commands, prefix } = bot;

    // Get the next argument as the command name.
    const commandName = commandArguments.shift();

    // Check if the command name exists.
    if (commandName) {
      // Get the command interface for the command name.
      const command = commands[commandName];

      // Check if the command does not exist.
      if (!command) {
        await message.reply(
          `sorry, but I could not find the \`${prefix}${commandName}\` command. Try \`${prefix}help\` for a list of available commands.`
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

      // Check if the command has paramenters.
      if (command.parameters) {
        commandEmbed.addField(
          "Parameters",
          command.parameters.join("\r\n").replace(/{@prefix}/gi, prefix)
        );
      }

      // Add the command usage.
      commandEmbed.addField(
        "Usage",
        `${prefix}${commandName}${
          command.parameters
            ? ` ${command.parameters
                .join(" ")
                .match(/<[a-z?/()]*>/g)
                ?.join(" ")}`
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
    helpEmbed.setTitle("Bot commands");

    // Add the description.
    helpEmbed.setDescription(
      `My available commands include the following. The command name must be prefixed with \`${prefix}\`, just like the \`${prefix}help\` command used to get this message. For information on a specific command, use \`${prefix}help <command>\`.`
    );

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
    helpEmbed.addField("Available commands", commandNames.join(" | "));

    // Add the footer.
    helpEmbed.setFooter("I hope I could help!");

    // Send the embed to the current channel.
    await channel.send(helpEmbed);
  },
};

export default help;
