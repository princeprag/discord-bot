import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const dnd: CommandInt = {
  name: "dnd",
  description: "List of the available Dungeons and Dragons commands",
  run: async (message) => {
    const { bot, channel, guild } = message;

    const { commands, prefix } = bot;

    if (!guild) {
      return;
    }

    // Create a new empty embed.
    const dndEmbed = new MessageEmbed();

    // Add the title.
    dndEmbed.setTitle("Dungeons and Dragons!");

    // Add the description.
    dndEmbed.setDescription("Here are the `dnd` commands I know!");

    // Get the available dnd commands.
    const dndCommands: CommandInt[] = Object.values(commands).filter(
      (command) =>
        (command.name &&
          command.name.startsWith("dnd") &&
          command.name !== "dnd") ||
        (command.names && command.names.find((el) => el.startsWith("dnd")))
    );

    // Add the dnd commands to embed fields.
    if (dndCommands.length) {
      for (const dndCommand of dndCommands) {
        dndEmbed.addField(
          prefix[guild.id] +
            (dndCommand.names ? dndCommand.names.join("/") : dndCommand.name) +
            (dndCommand.parameters
              ? ` ${dndCommand.parameters
                  .join(" ")
                  .match(/<[a-z?/()]*>/g)
                  ?.join(" ")}`
              : ""),
          dndCommand.description
        );
      }
    }

    // Send the embed to the current channel.
    await channel.send(dndEmbed);
  },
};

export default dnd;
