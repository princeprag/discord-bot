import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import CommandInt from "../../interfaces/CommandInt";

const search: CommandInt = {
  name: "search",
  description: "Returns a Google search link for the provided **query**.",
  parameters: ["`<query>`: the string to search for"],
  category: "general",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the arguments as a Google search query.
      const query = commandArguments
        .map((el) => el.replace(/<@!.*>%20/g, ""))
        .join("%20");

      // Check if the query is empty.
      if (!query || !query.length) {
        await message.reply("Searching for nothing? Why disturb me, then?");
        await message.react(message.Becca.no);
        return;
      }

      // Send the search url to the current channel.
      await channel.send(
        `I found something! https://google.com/search?q=${query}`
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "search command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default search;
