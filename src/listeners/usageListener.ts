import ListenerInt from "@Interfaces/ListenerInt";
import CommandLogModel, { CommandLogInt } from "@Models/CommandLogModel";

const usageListener: ListenerInt = {
  name: "Command uses",
  description: "Tracks the number of times each command has been used.",
  run: async (message) => {
    try {
      // Get the commandName, current guild and author of the message.
      const { commandName, guild, author } = message;

      // Check if the guild is valid.
      if (!guild) {
        return;
      }

      // Get the command log.
      const commandLog = await CommandLogModel.findOne({
        commandName: commandName,
      });

      // Check if the command log does not exist and create one.
      if (!commandLog) {
        await CommandLogModel.create<CommandLogInt>({
          commandName: commandName,
          uses: 1,
          lastUsed: new Date(Date.now()),
          lastUser: author.username,
          servers: [
            {
              serverID: guild.id,
              serverName: guild.name,
              serverUses: 1,
              serverLastUsed: new Date(Date.now()),
              serverLastUser: author.username,
            },
          ],
        });

        return;
      }

      //increment global uses
      commandLog.uses += 1;

      // get server and index from log
      const server = commandLog.servers.find((s) => s.serverID === guild.id);

      // if no, then add one
      if (!server) {
        commandLog.servers.push({
          serverID: guild.id,
          serverName: guild.name,
          serverUses: 1,
          serverLastUsed: new Date(Date.now()),
          serverLastUser: author.username,
        });
        commandLog.markModified("servers");
        await commandLog.save();
        return;
      }

      server.serverUses++;
      server.serverName = guild.name;
      server.serverLastUsed = new Date(Date.now());
      server.serverLastUser = author.username;
      commandLog.markModified("servers");

      // Save the command log.
      await commandLog.save();
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the usage listener. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the usage listener:`
      );
      console.log(error);
    }
  },
};

export default usageListener;
