import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { CommandInt } from "../interfaces/CommandInt";
import {
  RiddleGetInt,
  RiddleSolveInt,
  RiddleStartInt,
} from "../interfaces/RiddleInt";
import config from "../../config.json";

export const riddle: CommandInt = {
  prefix: "riddle",
  description:
    "Gets a riddle. Use the `start` function to begin, the `request` function to get a riddle, and the `solve` function to answer the riddle.",
  parameters:
    "`<function>` - determines how the command will run | `<id>` - the riddle id | `<answer?>` - the riddle answer",
  command: async (message) => {
    const functionArg = message.content.split(" ")[1];
    const idArg = message.content.split(" ")[2];
    const answerArg = message.content.split(" ").slice(3).join(" ");
    if (functionArg === "start") {
      const data = await fetch(
        "https://api.noopschallenge.com/riddlebot/start",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ login: "nhbot" }),
        }
      );
      const parsed: RiddleStartInt = await data.json();
      console.log(parsed);
      const riddleEmbed = new MessageEmbed()
        .setTitle("Start the riddle!")
        .setDescription(
          `Welcome to the riddles game! To get your first riddle, call this command: \`${
            config.prefix
          }riddle request ${parsed.riddlePath.split("/").reverse()[0]}\``
        );
      message.channel.send(riddleEmbed);
      return;
    }
    if (functionArg === "request") {
      const data = await fetch(
        `https://api.noopschallenge.com/riddlebot/riddles/${idArg}`
      );
      const parsed: RiddleGetInt = await data.json();
      const riddleEmbed = new MessageEmbed()
        .setTitle("Riddle")
        .setDescription(parsed.message)
        .addFields(
          { name: "Type", value: parsed.riddleType },
          { name: "Riddle", value: parsed.riddleText }
        );
      message.channel.send(riddleEmbed);
      return;
    }
    if (functionArg === "solve") {
      const data = await fetch(
        `https://api.noopschallenge.com/riddlebot/riddles/${idArg}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ answer: answerArg }),
        }
      );
      const parsed: RiddleSolveInt = await data.json();
      const riddleEmbed = new MessageEmbed()
        .setTitle("Riddle Solution")
        .addFields({ name: "Result", value: parsed.result });
      if (parsed.nextRiddlePath) {
        riddleEmbed.addFields({
          name: "Next Riddle ID",
          value: parsed.nextRiddlePath.split("/").reverse()[0],
        });
      }
      message.channel.send(riddleEmbed);
      return;
    }
    message.channel.send(
      "I'm sorry, but I do not see the correct information in your request. Please try again."
    );
  },
};
