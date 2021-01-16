import CommandInt from "@Interfaces/CommandInt";
import ChallengeInt, {
  ChallengeSolveInt,
  ChallengeStartInt,
} from "@Interfaces/commands/ChallengeInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const challenge: CommandInt = {
  name: "challenge",
  description:
    "Gets a programming challenge. Use the `start` function to begin, the `request` function to get a challenge, and the `solve` function to answer the challenge.",
  parameters: [
    "`<action (start/request/solve)>`: determines how the command will run",
    "`<id>`: the challenge id",
    "`<?answer>`: the challenge answer",
  ],
  category: "game",
  run: async (message) => {
    const { Becca, channel, commandArguments, guild } = message;

    const { prefix } = Becca;

    if (!guild) {
      return;
    }

    // Get the next argument as the action.
    const action = commandArguments.shift();

    // Check if the action is not `start`, `request` and `solve`.
    if (action !== "start" && action !== "request" && action !== "solve") {
      await message.reply(
        `Would you please use \`${prefix[guild.id]}challenge start\`, \`${
          prefix[guild.id]
        }challenge request <id>\` or \`${
          prefix[guild.id]
        }challenge solve <id> <answer>\`?`
      );
      await message.react(message.Becca.no);
      return;
    }

    try {
      // Check if the action is `start`.
      if (action === "start") {
        // Get the challenge information from noops challenge api.
        const data = await axios.get<ChallengeStartInt>(
          "https://api.noopschallenge.com/fizzbot"
        );

        // Get the next question from the data.
        const { nextQuestion } = data.data;

        // Send an embed to the current channel.
        await channel.send(
          new MessageEmbed()
            .setColor(Becca.color)
            .setTitle("Start the challenge!")
            .setDescription(
              `Welcome to the challenge game! To get your first challenge, please call this command: \`${
                prefix[guild.id]
              }challenge request ${nextQuestion.split("/").reverse()[0]}\``
            )
        );
      }
      // Check if the action is `request` or `solve`.
      else {
        // Get the next argument as the id.
        const id = commandArguments.shift();

        // Check if the id is not valid.
        if (!id) {
          await message.reply(
            "Would you please try the command again, and enter the challenge id?"
          );
          await message.react(message.Becca.no);
          return;
        }

        const challengeEmbed = new MessageEmbed();

        // Add the light purple color.
        challengeEmbed.setColor(Becca.color);

        // Check if the action is `request`.
        if (action === "request") {
          // Get the challenge information from the noops challenge api.
          const data = await axios.get<ChallengeInt>(
            `https://api.noopschallenge.com/fizzbot/questions/${id}`
          );

          // Add the title.
          challengeEmbed.setTitle("Challenge");

          // Add the description.
          challengeEmbed.setDescription(data.data.message);

          // Add the rest of the data fields as embed fields.
          for (const key in data.data) {
            if (key === "message") {
              continue;
            }

            challengeEmbed.addField(key, JSON.stringify(data.data[key]));
          }
        }
        // Otherwise, the action is `solve`.
        else {
          // Get the next argument as the answer.
          const answer = commandArguments.slice(0).join(" ");

          // Check if the answer is not valid.
          if (!answer) {
            await message.reply(
              "Would you please try the command again, and enter the challenge answer?"
            );
            await message.react(message.Becca.no);
            return;
          }
          console.log({ answer });

          try {
            // Get the challenge information from the noops challenge api.
            const data = await axios.post<ChallengeSolveInt>(
              `https://api.noopschallenge.com/fizzbot/questions/${id}`,
              { answer },
              {
                headers: {
                  "content-type": "application/json",
                },
              }
            );

            // Get the next question and the result from the data.
            const { nextQuestion, result } = data.data;

            // Add the title.
            challengeEmbed.setTitle("Challenge solution");

            // Add the description.
            challengeEmbed.setDescription(data.data.message);

            // Add the result field.
            challengeEmbed.addField("Result", result);

            // Check if the next question exists.
            if (nextQuestion && nextQuestion.length) {
              // Add the next question field.
              challengeEmbed.addField(
                "Next challenge ID",
                nextQuestion.split("/").reverse()[0]
              );
            }
          } catch (error) {
            // if error not in answer, throw it to higher try catch
            if (error?.status !== 400) {
              throw error;
            }

            // Add the data to the embed.
            challengeEmbed.setTitle("Challenge solution");
            challengeEmbed.setDescription(error.data.message);
            challengeEmbed.addField("Result", error.data.result);
          }
        }

        // Send the challenge embed to the current channel.
        await channel.send(challengeEmbed);
      }
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the challenge command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the challenge command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default challenge;
