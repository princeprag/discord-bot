import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const DND_CONSTANTS = {
  title: "Dungeons and Dragons!",
  description: "Here are the `dnd` commands I know!",
  error: "I am so sorry, but I cannot do that at the moment.",
};

const dnd: CommandInt = {
  name: "dnd",
  description: "List of the available Dungeons and Dragons commands",
  run: async (message) => {
    try {
      const { Becca, channel, guild } = message;

      const { commands, prefix } = Becca;

      if (!guild) {
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
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the dnd command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the dnd command:`
      );
      console.log(error);
      message.reply(DND_CONSTANTS.error);
    }
  },
};

export default dnd;
