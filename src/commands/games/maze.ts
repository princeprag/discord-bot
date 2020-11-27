import CommandInt from "@Interfaces/CommandInt";
import MazeInt, { MazeSolveInt } from "@Interfaces/commands/MazeInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const maze: CommandInt = {
  name: "maze",
  description:
    "Gets a random maze. Use the `request` function to get a random maze, and the `solve` function to <answer> the maze <id>.",
  parameters: [
    "`<action (request/solve)>`: determines how the command will run",
    "`<?id>`: the maze id",
    "`<?answer>`: the maze directions answer",
  ],
  run: async (message) => {
    try {
      const { Becca, channel, commandArguments, guild } = message;

      if (!guild) {
        return;
      }

      // Get the next argument as the action.
      const action = commandArguments.shift();

      // Check if the action is not `request` and `solve`.
      if (action !== "request" && action !== "solve") {
        await message.reply(
          "Would you please try the command again, and let me know if you want to `request` a maze or `solve` a maze?"
        );

        return;
      }

      // Create a new empty embed.
      const mazeEmbed = new MessageEmbed();

      // Add the light purple color.
      mazeEmbed.setColor(Becca.color);

      // Check if the action is `request`.
      if (action === "request") {
        // Get the data from the noops API.
        const data = await axios.get<MazeInt>(
          "https://api.noopschallenge.com/mazebot/random?maxSize=35"
        );

        const {
          endingPosition,
          exampleSolution,
          map,
          mazePath,
          name,
          startingPosition,
        } = data.data;

        // Add the maze data to the embed.
        mazeEmbed.setTitle(name);

        mazeEmbed.setDescription(
          `When you have finished, please use \`${
            Becca.prefix[guild.id]
          }maze solve ${
            mazePath.split("/").reverse()[0]
          } <answer>\`, where answer is a null-spaced string of cardinal directions.`
        );

        mazeEmbed.addField(
          "Starting position",
          JSON.stringify(startingPosition)
        );
        mazeEmbed.addField("Ending position", JSON.stringify(endingPosition));
        mazeEmbed.addField("Example answer", exampleSolution.directions);

        // Send the maze embed to the current channel.
        await channel.send(mazeEmbed);

        // Send the maze map to the current channel.
        await channel.send(
          `\`\`\`js\r\n${"_".repeat(
            map[0].toString().length + 2
          )}\r\n|${map.join("|\r\n|")}|\r\n${"¯".repeat(
            map[0].toString().length + 2
          )}\r\n\`\`\``
        );

        return;
      }
      // Otherwise, the action is `solve`.
      else {
        // Get the next argument as the maze id.
        const id = commandArguments.shift();

        // Check if the maze id is empty.
        if (!id) {
          await message.reply(
            "Would you please try the command again, and provide the maze id?"
          );
          return;
        }

        // Get the next argument as the maze answer.
        const answer = commandArguments.shift();

        // Check if the maze answer is empty.
        if (!answer) {
          await message.reply(
            "Would you please try the command again, and provide the maze answer?"
          );
          return;
        }

        // Get the solve data from the noops API.
        const data = await axios.post<MazeSolveInt>(
          `https://api.noopschallenge.com/mazebot/mazes/${id}`,
          {
            directions: answer,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const solution = data.data;

        // Add the data to the embed.
        mazeEmbed.setTitle("Solution");
        mazeEmbed.setDescription(solution.message);

        Object.entries(solution).forEach((el) => {
          if (el[0] === "message") {
            return;
          }

          mazeEmbed.addField(el[0], el[1]);
        });
      }

      // Send the maze embed to the current channel.
      await channel.send(mazeEmbed);
    } catch (error) {
      if (error.response.status === 400) {
        const challengeEmbed = new MessageEmbed();
        challengeEmbed.setTitle("Challenge solution");
        challengeEmbed.setDescription(error.response.data.message);
        challengeEmbed.addField("Result", error.response.data.result);
        message.channel.send(challengeEmbed);
        return;
      }
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the maze command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the maze command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default maze;
