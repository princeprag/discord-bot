import CommandInt from "../../interfaces/CommandInt";
import {
  RiddleGetInt,
  RiddleSolveInt,
  RiddleStartInt,
} from "../../interfaces/commands/RiddleInt";
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
  category: "game",
  run: async (message) => {
    const { author, Becca, channel, commandArguments, guild } = message;

    if (!guild) {
      await message.react(message.Becca.no);
      return;
    }

    // Get the next argument as the riddle action.
    const action = commandArguments.shift();

    // Check if the action is not `start`, `request` and `solve`.
    if (action !== "start" && action !== "request" && action !== "solve") {
      await message.reply(
        "Would you please try the command again, and tell me if you want to `start`, `request`, or `solve` a riddle?"
      );
      await message.react(message.Becca.no);
      return;
    }

    try {
      // Create a new empty embed.
      const riddleEmbed = new MessageEmbed();

      // Add the light purple color.
      riddleEmbed.setColor(Becca.color);

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
          `Welcome to the riddles game! To get your first riddle, please call this command: \`${
            Becca.prefix[guild.id]
          }riddle request ${start.riddlePath.split("/").reverse()[0]}\``
        );
      }
      // Otherwise, the action is `request` or `solve`.
      else {
        // Get the next argument as the riddle id.
        const id = commandArguments.shift();

        // Check if the riddle id is empty.
        if (!id) {
          await message.reply(
            "Would you please try the command again, and provide the riddle id?"
          );
          await message.react(message.Becca.no);
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
          riddleEmbed.addField(
            "Solve the Riddle",
            `Use the following command to solve the riddle: \`${
              message.Becca.prefix[guild.id]
            }riddle solve ${
              request.riddlePath.split("/").reverse()[0]
            } <answer>\``
          );
        }
        // Otherwise, the action is `solve`.
        else {
          // Get the next argument as the riddle answer.
          const answer = commandArguments.join(" ");

          // Check if the riddle answer is empty.
          if (!answer) {
            await message.reply(
              "Would you please try the command again, and provide the riddle answer?"
            );
            await message.react(message.Becca.no);
            return;
          }

          try {
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
            riddleEmbed.addField(
              "Next Riddle ID",
              solved.nextRiddlePath.split("/").reverse()[0]
            );
          } catch (error) {
            // if error not in answer, throw it to higher try catch
            if (error?.status !== 400) {
              throw error;
            }

            // Add the data to the embed.
            riddleEmbed.setTitle("Riddle solution");
            riddleEmbed.addField("Result", "incorrect");
            riddleEmbed.setDescription(error.data.message);
          }
        }
      }

      // Send the riddle embed to the current channel.
      await channel.send(riddleEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the riddle command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the riddle command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default riddle;
