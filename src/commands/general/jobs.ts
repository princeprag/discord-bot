import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const jobs: CommandInt = {
  name: "jobs",
  description:
    "Returns a LinkedIn job search for developers. Optionally narrows the search by **location**.",
  parameters: ["`<?location>`: the specific location to search for jobs."],
  category: "general",
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the LinkedIn search url.
      let url = "https://linkedin.com/jobs/search/?keywords=developer";

      // Get the arguments as a LikedIn search query.
      const query = commandArguments.join("%20").replace(/,/g, "%2C");

      // Check if the query is not empty.
      if (query.length) {
        url += `&location=${query}`;
      }

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor("#0E76A8")
          .setTitle("Job search!")
          .setDescription(`[Here are some potential jobs for you.](${url})`)
      );
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the jobs command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the jobs command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default jobs;
