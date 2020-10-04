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
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

    const { prefix } = bot;

    // Get the next argument as the action.
    const action = commandArguments.shift();

    // Check if the action is not `start`, `request` and `solve`.
    if (action !== "start" && action !== "request" && action !== "solve") {
      await message.reply(
        `sorry, but I just recognize \`${prefix}challenge start\`, \`${prefix}challenge request <id>\` or \`${prefix}challenge solve <id> <answer>\`.`
      );

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
            .setTitle("Start the challenge!")
            .setDescription(
              `Welcome to the challenge game! To get your first challenge, call this command: \`${prefix}challenge request ${
                nextQuestion.split("/").reverse()[0]
              }\``
            )
        );
      }
      // Check if the action is `request` or `solve`.
      else {
        // Get the next argument as the id.
        const id = commandArguments.shift();

        // Check if the id is not valid.
        if (!id) {
          await message.reply("sorry, but you must enter the challenge id.");
          return;
        }

        const challengeEmbed = new MessageEmbed();

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
          const answer = commandArguments.shift();

          // Check if the answer is not valid.
          if (!answer) {
            await message.reply(
              "sorry, but you must enter the challenge answer."
            );

            return;
          }

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
        }

        // Send the challenge embed to the current channel.
        await channel.send(challengeEmbed);
      }
    } catch (error) {
      console.log(
        "Challenge command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      await message.reply(
        `sorry, but I cannot execute the \`${action}\` action inside the challenge.`
      );

      return;
    }
  },
};

export default challenge;
