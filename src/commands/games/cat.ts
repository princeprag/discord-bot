import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import CommandInt from "../../interfaces/CommandInt";

const cat: CommandInt = {
  name: "cat",
  description: "A cat walked across the keyboard!",
  category: "game",
  run: async (message) => {
    try {
      const { channel, sleep } = message;

      // Get a random length for the new string.
      const len = ~~(Math.random() * 100);

      // Create an empty string.
      let str = "";

      for (let i = 0; i < len; i++) {
        // Get a random character.
        const char = ~~(Math.random() * 26 + 64);

        // Append the character to the string.
        str += String.fromCharCode(char);
      }

      // Send the new string to the current channel.
      await channel.send(str);

      // Sleep by 1 second.
      await sleep(1000);

      // Send a message to the current channel.
      await channel.send("My familiar wanted to send you a message, it seems.");
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "cat command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default cat;
