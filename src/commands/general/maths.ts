import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";

const maths: CommandInt = {
  name: "maths",
  description: "Returns the result of evaluating the expression.",
  parameters: ["`<problem>`: expression to process"],
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments } = message;

      // Get the arguments as the problem.
      const problem = commandArguments.join(" ");

      // Get the answer of the problem.
      let answer;
      try {
        answer = evaluate(problem);
      } catch (err) {
        console.log(err);
      }

      // Check if the problem is empty.
      if (!answer || !problem) {
        await message.reply(
          "I am so sorry, but that does not appear to be a valid math expression."
        );

        return;
      }

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle("Calculating...")
          .setDescription("I hope I did this right.")
          .addField("Input", problem)
          .addField("Result", answer)
      );
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the maths command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the maths command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default maths;
