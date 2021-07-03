import { Message, MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { sleep } from "../../utils/sleep";

export const guess: CommandInt = {
  name: "guess",
  description:
    "Play a round of Guess the Number! Becca will choose a number between 1 and 1000. Players have 10 seconds to guess. Closest guess wins!",
  parameters: [],
  category: "game",
  run: async (Becca, message) => {
    try {
      const random = Math.ceil(Math.random() * 1000);
      const guesses: { userID: string; guess: number }[] = [];
      const winEmbed = new MessageEmbed();
      winEmbed.setTimestamp();
      winEmbed.setColor(Becca.colours.default);

      await message.channel.send(
        "I have a challenge for you. I have chosen a number between 1 and 1000. You have 10 seconds to guess the number. The closest guess will win!"
      );

      const guessCollector = message.channel.createMessageCollector(
        (m: Message) => !isNaN(parseInt(m.content)),
        { time: 10000 }
      );

      guessCollector.on("collect", (msg) => {
        if (guesses.find((g) => g.userID === msg.author.id)) {
          return;
        }
        guesses.push({
          userID: msg.author.id,
          guess: parseInt(msg.content),
        });
      });

      guessCollector.on("end", async () => {
        await message.channel.send("Time is up! I am calculating the results.");
        let winValue = 10000;
        let winAuthor;
        let winGuess;
        for (const guess of guesses) {
          const result = Math.abs(guess.guess - random);
          if (result < winValue) {
            winValue = result;
            winAuthor = guess.userID;
            winGuess = guess.guess;
          }
        }

        winEmbed.setTitle("We have a winner");
        winEmbed.setDescription(`<@!${winAuthor}> wins!`);
        winEmbed.addField("Guess", winGuess, true);
        winEmbed.addField("Random number", random, true);
        winEmbed.addField("Difference", winValue, true);
      });

      await sleep(15000);
      return { success: true, content: winEmbed };
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "guess command",
        err,
        message.guild?.id,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "guess") };
    }
  },
};
