import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { AdventureInt } from "../interfaces/AdventureInt";
import { CommandInt } from "../interfaces/CommandInt";
import config from "../../config.json";

export const adventure: CommandInt = {
  prefix: "adventure",
  description: "Go on an adventure!",
  parameters:
    "`<function>` - `start` an adventure, or `move` | `<room>` - the ID of the room you are in | `<direction>` - the direction you want to move",
  command: async (message) => {
    const functionArg = message.content.split(" ")[1];
    const roomArg = message.content.split(" ")[2];
    const directionArg = message.content.split(" ")[3];
    if (functionArg === "start") {
      const data = await fetch("https://api.noopschallenge.com/pathbot/start", {
        method: "POST",
      });
      const parsed: AdventureInt = await data.json();
      const adventureEmbed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Adventure!`)
        .setDescription(parsed.message + parsed.description)
        .addFields(
          { name: "Room exits", value: JSON.stringify(parsed.exits) },
          {
            name: "Maze Exit",
            value: `The exit is ${parsed.mazeExitDirection}, about ${parsed.mazeExitDistance} rooms away.`,
          },
          {
            name: "To move:",
            value: `Use the command \`${config.prefix}adventure move ${
              parsed.locationPath.split("/").reverse()[0]
            } <direction>\``,
          }
        );
      message.channel.send(adventureEmbed);
      return;
    }
    if (functionArg === "move") {
      const data = await fetch(
        `https://api.noopschallenge.com/pathbot/rooms/${roomArg}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ direction: directionArg.toUpperCase() }),
        }
      );
      const parsed: AdventureInt = await data.json();
      const adventureEmbed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Adventure!`)
        .setDescription(parsed.message + parsed.description)
        .addFields(
          { name: "Room exits", value: JSON.stringify(parsed.exits) },
          {
            name: "Maze Exit",
            value: `The exit is ${parsed.mazeExitDirection}, about ${parsed.mazeExitDistance} rooms away.`,
          },
          {
            name: "To move:",
            value: `Use the command \`${config.prefix}adventure move ${
              parsed.locationPath.split("/").reverse()[0]
            } <direction>\``,
          }
        );
      message.channel.send(adventureEmbed);
      return;
    }
  },
};
