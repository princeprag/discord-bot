import CommandInt from "../../interfaces/CommandInt";
import { Message } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const guess: CommandInt = {
  name: "guess",
  description:
    "Play a Guess the Number game! Becca will choose a number between 1 and 1000. Players have 10 seconds to guess. Closest guess wins!",
  category: "game",
  run: async (message) => {
    try {
      const { channel } = message;

      // Get a random number between 1 and 1000.
      const random = ~~(Math.random() * 1000) + 1;

      // Create a new empty array.
      const guesses: string[][] = [];

      // Send a message to the current channel.
      await channel.send(
        "I have a challenge for you. I have chosen a number between 1 and 1000. You have 10 seconds to guess the number. The closest guess will win!"
      );

      // Create a new message collector for the current channel.
      const guessCollector = channel.createMessageCollector(
        (m: Message) => !isNaN(Number(m.content)),
        { time: 10000 }
      );

      // When a message is collect.
      guessCollector.on("collect", (msg) => {
        // Append the user id and the content of the message.
        guesses.push([msg.author.id, Number(msg.content)]);
      });

      // When the collector is in the end.
      guessCollector.on("end", async () => {
        let winVal = 1000,
          winAuth,
          winGuess;

        // Get the winner.
        for (const guess of guesses) {
          const result = Math.abs(Number(guess[1]) - random);

          if (result < winVal) {
            winVal = result;
            winAuth = guess[0];
            winGuess = guess[1];
          }
        }

        // Send a message to the current channel.
        await channel.send(
          `And the winner is... <@!${winAuth}>! My number was ${random} and the winning guess was ${winGuess}.`
        );
      });
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "guess command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default guess;
