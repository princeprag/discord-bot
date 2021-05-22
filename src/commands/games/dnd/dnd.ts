import CommandInt from "../../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

const DND_CONSTANTS = {
  title: "Dungeons and Dragons!",
  description: "Here are the `dnd` skills I have.",
};

const dnd: CommandInt = {
  name: "dnd",
  description: "List of the available Dungeons and Dragons commands",
  category: "game",
  run: async (message) => {
    try {
      const { Becca, channel, guild } = message;

      const { commands, prefix } = Becca;

      if (!guild) {
        await message.react(Becca.no);
        return;
      }

      // Create a new empty embed.
      const dndEmbed = new MessageEmbed();

      // Add the title.
      dndEmbed.setTitle(DND_CONSTANTS.title);

      // Add the description.
      dndEmbed.setDescription(DND_CONSTANTS.description);

      // Get the available dnd commands.
      const dndCommands: Set<CommandInt> = new Set(
        Object.values(commands).filter(
          (command) =>
            command.name &&
            command.name.startsWith("dnd") &&
            command.name !== "dnd"
        )
      );

      // Add the dnd commands to embed fields.
      if (dndCommands.size) {
        for (const dndCommand of dndCommands) {
          dndEmbed.addField(
            prefix[guild.id] +
              dndCommand.name +
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
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "dnd command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default dnd;
