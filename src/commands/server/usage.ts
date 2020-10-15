import CommandInt from "@Interfaces/CommandInt";
import CommandLogModel from "@Models/CommandLogModel";
import { MessageEmbed } from "discord.js";

const usage: CommandInt = {
  names: ["usage", "commandusage"],
  description:
    "Gets the number of times a particular **command** has been used.",
  parameters: ["`<command>`: name of the command to check"],
  run: async (message) => {
    const { bot, channel, commandArguments, guild } = message;

    // Get the next argument as the command name.
    const command = commandArguments.shift();

    // Check if the command name is empty.
    if (!guild || !command) {
      await message.reply(
        "Would you please provide the command you want me to look for?"
      );

      return;
    }

    // Get the command log from the database.
    const commandLog = await CommandLogModel.findOne({
      command,
      server_id: guild.id,
    });

    // Check if the command log does not exist.
    if (!commandLog) {
      await message.reply(
        "I am so sorry, but no one has used this command yet."
      );

      return;
    }

    const { last_called, last_caller, uses } = commandLog;

    // Send an embed message to the current channel.
    await channel.send(
      new MessageEmbed()
        .setColor(bot.color)
        .setTitle(bot.prefix[guild.id] + command)
        .setDescription(`This command has been used ${uses} times!`)
        .setFooter(
          `The command was last called by ${last_caller} on ${last_called}`
        )
    );
  },
};

export default usage;
