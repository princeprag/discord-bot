import CommandInt from "@Interfaces/CommandInt";

const wiki: CommandInt = {
  name: "wiki",
  description: "Returns a URL to a wikipedia article based on the **query**.",
  parameters: ["`<query>`: terms to search for"],
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the arguments as a Wikipedia search query.
      const query = commandArguments.join("_");

      // Check if the query is empty.
      if (!query || !query.length) {
        await message.reply(
          "Would you please provide the term you want me to search for?"
        );
        return;
      }

      // Send the Wikipedia url to the current channel.
      await channel.send(
        `Here is what I found: https://en.wikipedia.org/wiki/${query}`
      );
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the wiki command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default wiki;
