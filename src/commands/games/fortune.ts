import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import CommandInt from "../../interfaces/CommandInt";
import fortunesList from "../../utils/commands/fortunesList";

const fortune: CommandInt = {
  name: "fortune",
  description: "Tells you a fortune.",
  category: "game",
  run: async (message) => {
    try {
      const { channel } = message;

      // Get a random fortune number.
      const random = ~~(Math.random() * fortunesList.length - 1);

      // Send the random fortune message to the current channel.
      await channel.send(fortunesList[random]);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "fortune command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default fortune;
