import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { evaluate } from "mathjs";

const maths: CommandInt = {
  name: "maths",
  description: "Returns the result of evaluating the expression.",
  parameters: ["`<problem>`: expression to process"],
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

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
        "Sorry, but that does not appear to be a valid math expression."
      );

      return;
    }

    // Send an embed message to the current channel.
    await channel.send(
      new MessageEmbed()
        .setColor(bot.color)
        .setTitle("Calculating...")
        .setDescription("All done!")
        .addField("Input", problem)
        .addField("Result", answer)
    );
  },
};

export default maths;
