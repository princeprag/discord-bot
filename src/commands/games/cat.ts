import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const cat: CommandInt = {
  name: "cat",
  description: "A cat walked across the keyboard",
  category: "game",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const length = Math.floor(Math.random() * 100);
      let str = "";

      for (let i = 0; i < length; i++) {
        const character = Math.floor(Math.random() * 26 + 64);
        str += String.fromCharCode(character);
      }
      return {
        success: true,
        content: `${str}\nMy familiar wanted to send you a message.`,
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "cat command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "cat", errorId) };
    }
  },
};
