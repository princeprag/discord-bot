import CommandInt from "@Interfaces/CommandInt";
import TriviaInt from "@Interfaces/commands/TriviaInt";
import axios from "axios";
import { Message, MessageEmbed } from "discord.js";

function replaceHTML(text: string): string {
  return text
    .replace(/&quot;/g, `"`)
    .replace(/&#039;/g, `'`)
    .replace(/ &amp;/g, `&`);
}

const trivia: CommandInt = {
  name: "trivia",
  description:
    "Provides a trivia question. 30 seconds later, will provide the answer.",
  run: async (message) => {
    try {
      const { Becca, channel } = message;

      const letters = ["A", "B", "C", "D"];

      // Get the question from the API.
      const data = await axios.get<TriviaInt>(
        "https://opentdb.com/api.php?amount=1&type=multiple"
      );

      const {
        category,
        correct_answer,
        incorrect_answers,
        question,
      } = data.data.results[0];

      // Add the incorrect answers to a list.
      const answers = incorrect_answers.map((el) => replaceHTML(el));

      // Get the correct answer.
      const correctAnswer = replaceHTML(correct_answer);

      // Add the correct answer to the answers list.
      answers.push(correctAnswer);

      // Sort the answers.
      answers.sort();

      // Get the correct answer letter.
      const correctAnswerLetter = letters[answers.indexOf(correctAnswer)];

      const answered: string[] = [];
      const correct: string[] = [];

      // Send an embed message to the current channel.
      await channel.send(
        new MessageEmbed()
          .setColor(Becca.color)
          .setTitle(category)
          .setDescription(replaceHTML(question))
          .addField("A", answers[0], true)
          .addField("B", answers[1], true)
          .addField("\u200b", "\u200b", true)
          .addField("C", answers[2], true)
          .addField("D", answers[3], true)
          .addField("\u200b", "\u200b", true)
          .setFooter(
            "Please tell me what you think is the correct answer! You have 30 seconds..."
          )
      );

      // Create a new message collector.
      const collector = channel.createMessageCollector(
        (msg: Message) => !msg.author.bot && msg.content.length === 1,
        { time: 30000 }
      );

      // On message collector.
      collector.on("collect", (reply: Message) => {
        // Check if the reply author answered before.
        if (answered.includes(reply.author.toString())) {
          return;
        }

        // Check if the reply content is the correct answer
        if (reply.content === correctAnswerLetter) {
          correct.push(reply.author.toString());
        }

        // Add the reply author to the answered list.
        answered.push(reply.author.toString());
      });

      // On collector end.
      collector.on("end", async () => {
        await channel.send(
          `The correct answer is... **${correctAnswerLetter}** ${correctAnswer}`
        );

        await channel.send(
          correct.length
            ? `Congratulations to ${correct.join(", ")}!`
            : "No one got this question correct :("
        );
      });
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the trivia command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the trivia command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default trivia;
