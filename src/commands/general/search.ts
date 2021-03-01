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
        await message.reply(
          "Would you please try the command again, and provide the term you want me to search for?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Send the search url to the current channel.
      await channel.send(
        `I found something! https://google.com/search?q=${query}`
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the search command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the search command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default search;
