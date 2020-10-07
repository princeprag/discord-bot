import CommandInt from "@Interfaces/CommandInt";
import {
  RiddleGetInt,
  RiddleSolveInt,
  RiddleStartInt,
} from "@Interfaces/commands/RiddleInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const riddle: CommandInt = {
  name: "riddle",
  description:
    "Gets a riddle. Use the `start` function to begin, the `request` function to get a riddle, and the `solve` function to answer the riddle.",
  parameters: [
    "`<action (start/request/solve)>`: determines how the command will run",
    "`<?id>`: the riddle id",
    "`<?answer>`: the riddle answer",
  ],
  run: async (message) => {
    const { author, bot, channel, commandArguments, guild } = message;

    if (!guild) {
      return;
    }

    // Get the next argument as the riddle action.
    const action = commandArguments.shift();

    // Check if the action is not `start`, `request` and `solve`.
    if (action !== "start" && action !== "request" && action !== "solve") {
      await message.reply(
        "I'm sorry, but I do not see the correct information in your request. Please try again."
      );

      return;
    }

    try {
      // Create a new empty embed.
      const riddleEmbed = new MessageEmbed();

      // Add the light purple color.
      riddleEmbed.setColor(bot.color);

      // Check if the action is `start`.
      if (action === "start") {
        const data = await axios.post<RiddleStartInt>(
          "https://api.noopschallenge.com/riddlebot/start",
          {
            login: author.username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const start = data.data;

        // Add the riddle data to the embed.
        riddleEmbed.setTitle("Start the riddle!");

        riddleEmbed.setDescription(
          `Welcome to the riddles game! To get your first riddle, call this command: \`${
            bot.prefix[guild.id]
          }riddle request ${start.riddlePath.split("/").reverse()[0]}\``
        );
      }
      // Otherwise, the action is `request` or `solve`.
      else {
        // Get the next argument as the riddle id.
        const id = commandArguments.shift();

        // Check if the riddle id is empty.
        if (!id) {
          await message.reply("Sorry, you must enter the riddle id.");
          return;
        }

        // Check if the action is `request`.
        if (action === "request") {
          const data = await axios.get<RiddleGetInt>(
            `https://api.noopschallenge.com/riddlebot/riddles/${id}`
          );

          const request = data.data;

          // Add the data to the embed.
          riddleEmbed.setTitle("Riddle");
          riddleEmbed.setDescription(request.message);
          riddleEmbed.addField("Type", request.riddleType);
          riddleEmbed.addField("Riddle", request.riddleText);
        }
        // Otherwise, the action is `solve`.
        else {
          // Get the next argument as the riddle answer.
          const answer = commandArguments.join(" ");

          // Check if the riddle answer is empty.
          if (!answer) {
            await message.reply("Sorry, you must enter the riddle answer.");
            return;
          }

          const data = await axios.post<RiddleSolveInt>(
            `https://api.noopschallenge.com/riddlebot/riddles/${id}`,
            { answer },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const solved = data.data;

          // Add the data to the embed.
          riddleEmbed.setTitle("Riddle solution");
          riddleEmbed.addField("Result", solved.result);

          if (solved.nextRiddlePath) {
            riddleEmbed.addField(
              "Next Riddle ID",
              solved.nextRiddlePath.split("/").reverse()[0]
            );
          }
        }
      }

      // Send the riddle embed to the current channel.
      await channel.send(riddleEmbed);
    } catch (error) {
      console.log(
        "Riddle command:",
        error?.response?.data?.message ?? "Unknown error"
      );

      const errorEmbed = new MessageEmbed();
      errorEmbed.setColor(bot.color);
      errorEmbed.setTitle("Riddle Error");
      errorEmbed.setDescription(
        "Error happened while working on your riddle. Please, try again, or wait a bit."
      );

      await message.reply(errorEmbed);
    }
  },
};

export default riddle;
