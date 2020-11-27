import CommandInt from "@Interfaces/CommandInt";
import CommandLogModel from "@Models/CommandLogModel";
import { MessageEmbed } from "discord.js";

const usage: CommandInt = {
  name: "usage",
  description:
    "Gets the number of times a particular **command** has been used.",
  parameters: ["`<command>`: name of the command to check"],
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments, guild } = message;

      // Get the next argument as the command name.
      const command = commandArguments.shift();

      // Check if the command name is empty.
      if (!guild || !command) {
        await message.reply(
          "Would you please try the command again, and provide the command you want me to look for?"
        );

        return;
      }

      // Get the command log from the database.
      const commandLog = await CommandLogModel.findOne({
        commandName: command,
      });

      // Check if the command log does not exist.
      if (!commandLog) {
        await message.reply(
          `I am so sorry, but no one has used the ${command} command yet.`
        );

        return;
      }

      const serverLog = commandLog.servers.find((s) => s.serverID === guild.id);

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle(Becca.prefix[guild.id] + command)
          .setDescription("Here's what I have for this command:")
          .addFields(
            {
              name: "Global Usage",
              value: commandLog
                ? `This command has been used a total of ${
                    commandLog.uses
                  } times. It was last used by ${
                    commandLog.lastUser
                  } on ${commandLog.lastUsed.toLocaleDateString()}`
                : "This command has not been used yet!",
            },
            {
              name: "Server Usage",
              value: serverLog
                ? `This command has been used in ${
                    serverLog.serverName
                  } a total of ${
                    serverLog.serverUses
                  } times. It was last used by ${
                    serverLog.serverLastUser
                  } on ${serverLog.serverLastUsed.toLocaleDateString()}`
                : `This command has not been used in ${guild.name} yet!`,
            }
          )
      );
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the usage command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the usage command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default usage;
