import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { beccaLogger } from "../../utils/beccaLogger";

const maths: CommandInt = {
  name: "maths",
  description: "Returns the result of evaluating the expression.",
  parameters: ["`<problem>`: expression to process"],
  category: "general",
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
        beccaLogger.log("verbose", err);
      }

      // Check if the problem is empty.
      if (!answer || !problem) {
        await message.reply(
          "I am so sorry, but that does not appear to be a valid math expression."
        );
        await message.react(message.Becca.no);
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
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "maths command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default maths;
