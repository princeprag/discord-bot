import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const HELP_CONSTANTS = {
  title: "Becca's commands",
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
          await message.reply(
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
      const emoteCommandNames: string[] = [];
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
          case "emote":
            emoteCommandNames.push(`\`${command.name}\``);
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
        "Bot-related Commands",
        botCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "Emote Commands",
        emoteCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "Game-related Commands",
        gameCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "General Commands",
        generalCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "Moderation Commands",
        moderationCommandNames.sort().join(" | ")
      );
      helpEmbed.addField(
        "Server Commands",
        serverCommandNames.sort().join(" | ")
      );
      // Add the footer.
      helpEmbed.setFooter(HELP_CONSTANTS.footer);

      // Send the embed to the current channel.
      await channel.send(helpEmbed);
      await message.react(Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the help command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the help command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default help;
