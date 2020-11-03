import ListenerInt from "@Interfaces/ListenerInt";
import CommandLogModel, {
  CommandLogIntRequired,
} from "@Models/CommandLogModel";

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
        command: commandName,
        server_id: guild.id,
      });

      // Check if the command log does not exist and create one.
      if (!commandLog) {
        await CommandLogModel.create<CommandLogIntRequired>({
          command: commandName,
          server_id: guild.id,
          last_caller: author.username,
        });

        return;
      }

      commandLog.uses += 1;
      commandLog.last_called = Date.now();
      commandLog.last_caller = author.username;

      // Save the command log.
      await commandLog.save();
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the usage listener:`
      );
      console.log(error);
    }
  },
};

export default usageListener;
