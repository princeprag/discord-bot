import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { CommandInt } from "../interfaces/CommandInt";
import { MazeInt, MazeSolveInt } from "../interfaces/MazeInt";
import config from "../../config.json";

export const maze: CommandInt = {
  prefix: "maze",
  description:
    "Gets a random maze. Use the `request` function to get a random maze, and the `solve` function to <answer> the maze <id>.",
  parameters:
    "`<function>` - determines how the command will run | `<id>` - the riddle id | `<answer?>` - the riddle answer",
  command: async (message) => {
    const functionArg = message.content.split(" ")[1];
    const idArg = message.content.split(" ")[2];
    const answerArg = message.content.split(" ").slice(3).join("");
    if (functionArg === "request") {
      const data = await fetch(
        "https://api.noopschallenge.com/mazebot/random?maxSize=35"
      );
      const parsed: MazeInt = await data.json();
      const mazeEmbed = new MessageEmbed()
        .setTitle(parsed.name)
        .setDescription(
          `When you have finished, use \`${config.prefix}maze solve ${
            parsed.mazePath.split("/").reverse()[0]
          } <answer>\`, where answer is a null-spaced string of cardinal directions.`
        )
        .addFields(
          {
            name: "Starting Position",
            value: JSON.stringify(parsed.startingPosition),
          },
          {
            name: "Ending Position",
            value: JSON.stringify(parsed.endingPosition),
          },
          { name: "Example Answer", value: parsed.exampleSolution.directions }
        );
      const mazeMap = `\`\`\`js\n${"_".repeat(
        parsed.map[0].toString().length + 2
      )}\n|${parsed.map.join("|\n|")}|\n${"¯".repeat(
        parsed.map[0].toString().length + 2
      )}\n\`\`\``;
      message.channel.send(mazeEmbed);
      message.channel.send(mazeMap);
      return;
    }
    if (functionArg === "solve") {
      const data = await fetch(
        `https://api.noopschallenge.com/mazebot/mazes/${idArg}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ directions: answerArg }),
        }
      );
      const parsed: MazeSolveInt = await data.json();
      const mazeEmbed = new MessageEmbed()
        .setTitle("Solution")
        .setDescription(parsed.message);
      Object.entries(parsed).forEach((el) => {
        if (el[0] === "message") {
          return;
        }
        mazeEmbed.addFields({ name: el[0], value: el[1] });
      });
      message.channel.send(mazeEmbed);
      return;
    }
    message.channel.send(
      "I'm sorry, but I do not see the correct information in your request. Please try again."
    );
  },
};
