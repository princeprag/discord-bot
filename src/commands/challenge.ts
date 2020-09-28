import { MessageEmbed } from "discord.js";
import {
  ChallengeInt,
  ChallengeSolveInt,
  ChallengeStartInt,
} from "../interfaces/ChallengeInt";
import { CommandInt } from "../interfaces/CommandInt";
import config from "../../config.json";
import fetch from "node-fetch";

export const challenge: CommandInt = {
  prefix: "challenge",
  description:
    "Gets a programming challenge. Use the `start` function to begin, the `request` function to get a riddle, and the `solve` function to answer the riddle.",
  parameters:
    "`<function>` - determines how the command will run | `<id>` - the riddle id | `<answer?>` - the riddle answer",
  command: async (message) => {
    const functionArg = message.content.split(" ")[1];
    const idArg = message.content.split(" ")[2];
    const answerArg = message.content.split(" ").slice(3).join(" ");
    if (functionArg === "start") {
      const data = await fetch("https://api.noopschallenge.com/fizzbot");
      const parsed: ChallengeStartInt = await data.json();
      const challengeEmbed = new MessageEmbed()
        .setTitle("Start the challenge!")
        .setDescription(
          `Welcome to the challenge game! To get your first challenge, call this command: \`${
            config.prefix
          }challenge request ${parsed.nextQuestion.split("/").reverse()[0]}\``
        );
      message.channel.send(challengeEmbed);
      return;
    }
    if (functionArg === "request") {
      const data = await fetch(
        `https://api.noopschallenge.com/fizzbot/questions/${idArg}`
      );
      const parsed: ChallengeInt = await data.json();
      const challengeEmbed = new MessageEmbed()
        .setTitle("Riddle")
        .setDescription(parsed.message);
      Object.entries(parsed).forEach((el) => {
        if (el[0] === "message") {
          return;
        }
        challengeEmbed.addFields({ name: el[0], value: JSON.stringify(el[1]) });
      });
      message.channel.send(challengeEmbed);
      return;
    }
    if (functionArg === "solve") {
      const data = await fetch(
        `https://api.noopschallenge.com/fizzbot/questions/${idArg}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ answer: answerArg }),
        }
      );
      const parsed: ChallengeSolveInt = await data.json();
      const challengeEmbed = new MessageEmbed()
        .setTitle("Challenge Solution")
        .setDescription(parsed.message)
        .addFields({ name: "Result", value: parsed.result });
      if (parsed.nextQuestion) {
        challengeEmbed.addFields({
          name: "Next Challenge ID",
          value: parsed.nextQuestion.split("/").reverse()[0],
        });
      }
      message.channel.send(challengeEmbed);
      return;
    }
    message.channel.send(
      "I'm sorry, but I do not see the correct information in your request. Please try again."
    );
  },
};
