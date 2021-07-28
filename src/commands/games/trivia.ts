import axios from "axios";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { TriviaInt } from "../../interfaces/commands/games/TriviaInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";
import { replaceHtml } from "../../utils/replaceHtml";
import { sleep } from "../../utils/sleep";

export const trivia: CommandInt = {
  name: "trivia",
  description: "Start a trivia session",
  category: "game",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const letters = ["A", "B", "C", "D"];

      const data = await axios.get<TriviaInt>(
        "https://opentdb.com/api.php?amount=1&type=multiple"
      );

      const { category, correct_answer, incorrect_answers, question } =
        data.data.results[0];

      const answers = incorrect_answers.map((el) => replaceHtml(el));
      answers.push(replaceHtml(correct_answer));
      answers.sort();

      const correctAnswerLetter =
        letters[answers.indexOf(replaceHtml(correct_answer))];

      const answered: string[] = [];
      const correct: string[] = [];

      const triviaEmbed = new MessageEmbed();
      triviaEmbed.setColor(Becca.colours.default);
      triviaEmbed.setTitle(category);
      triviaEmbed.setDescription(replaceHtml(question));
      triviaEmbed.addField("A", answers[0], true);
      triviaEmbed.addField("B", answers[1], true);
      triviaEmbed.addField("\u200b", "\u200b", true);
      triviaEmbed.addField("C", answers[2], true);
      triviaEmbed.addField("D", answers[3], true);
      triviaEmbed.addField("\u200b", "\u200b", true);
      triviaEmbed.setFooter(
        "Can you answer this correctly in 30 seconds? Good luck..."
      );

      const resultEmbed = new MessageEmbed();

      await message.channel.send({ embeds: [triviaEmbed] });

      const answerCollector = message.channel.createMessageCollector({
        time: 30000,
        filter: (msg) =>
          !msg.author.bot && letters.includes(msg.content.toUpperCase()),
      });

      answerCollector.on("collect", (msg) => {
        if (answered.includes(msg.author.id)) {
          return;
        }

        if (msg.content.toUpperCase() === correctAnswerLetter) {
          correct.push(msg.author.id);
        }
        answered.push(msg.author.id);
      });

      answerCollector.on("end", async () => {
        await message.channel.send(
          "Time is up! I will now determine the winners..."
        );

        resultEmbed.setTimestamp();
        resultEmbed.setColor(Becca.colours.default);
        resultEmbed.setTitle(`${correct.length} of you got this right!`);
        resultEmbed.setDescription(
          customSubstring(correct.map((el) => `<@!${el}>`).join(", "), 4000)
        );
        resultEmbed.addField(
          "Correct Answer:",
          `${correctAnswerLetter}: ${replaceHtml(correct_answer)}`
        );
      });

      await sleep(35000);
      return { success: true, content: resultEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "trivia command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "trivia", errorId),
      };
    }
  },
};
