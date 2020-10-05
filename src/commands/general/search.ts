import CommandInt from "@Interfaces/CommandInt";

const search: CommandInt = {
  name: "search",
  description: "Returns a Google search link for the provided **query**.",
  parameters: ["`<query>`: the string to search for"],
  run: async (message) => {
    const { channel, commandArguments } = message;

    // Get the arguments as a Google search query.
    const query = commandArguments
      .map((el) => el.replace(/<@!.*>%20/g, ""))
      .join("%20");

    // Check if the query is empty.
    if (!query || !query.length) {
      await message.reply("sorry, but what did you want me to search for?");
      return;
    }

    // Send the search url to the current channel.
    await channel.send(
      `BEEP BOOP: Query complete. https://google.com/search?q=${query}`
    );
  },
};

export default search;
