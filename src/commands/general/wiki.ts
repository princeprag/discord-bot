import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import CommandInt from "../../interfaces/CommandInt";

const wiki: CommandInt = {
  name: "wiki",
  description: "Returns a URL to a wikipedia article based on the **query**.",
  parameters: ["`<query>`: terms to search for"],
  category: "general",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the arguments as a Wikipedia search query.
      const query = commandArguments.join("_");

      // Check if the query is empty.
      if (!query || !query.length) {
        await message.channel.send(
          "There are an almost infinite number of records here. You're going to have to tell me what to look for."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Send the Wikipedia url to the current channel.
      await channel.send(
        `Here is what I found: https://en.wikipedia.org/wiki/${query}`
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "wiki command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default wiki;
