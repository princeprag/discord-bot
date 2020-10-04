import CommandInt from "@Interfaces/CommandInt";
import AdventureInt from "@Interfaces/commands/AdventureInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

function addInfoToEmbed(
  prefix: string,
  data: AdventureInt,
  embed: MessageEmbed
): MessageEmbed {
  const {
    message,
    description,
    exits,
    locationPath,
    mazeExitDirection,
    mazeExitDistance,
  } = data as AdventureInt;

  embed.setDescription(message + description);

  embed.addField("Room exits", JSON.stringify(exits));

  embed.addField(
    "Maze exit",
    `The exit is ${mazeExitDirection}, about ${mazeExitDistance} rooms away.`
  );

  embed.addField(
    "To move",
    `Use the command \`${prefix}adventure move ${
      locationPath.split("/").reverse()[0]
    } <direction>\``
  );

  return embed;
}

const adventure: CommandInt = {
  name: "adventure",
  description: "Go on an adventure!",
  parameters: [
    "`<action (start/move)>`: `start` an adventure, or `move`",
    "`<room>`: the ID of the room you are in",
    "`<direction>`: the direction you want to move",
  ],
  run: async (message) => {
    const { author, bot, channel, commandArguments } = message;

    const { prefix } = bot;

    // Get the next argument as the action.
    const action = commandArguments.shift();

    // Check if the action is not `start` and `move`.
    if (action !== "start" && action !== "move") {
      await message.reply(
        `sorry, but I just recognize \`${prefix}adventure start\` or \`${prefix}adventure move <room> <direction>\`.`
      );

      return;
    }

    // Create a new empty embed.
    let adventureEmbed = new MessageEmbed();

    // Set the title.
    adventureEmbed.setTitle(`${author.username}'s adventure!`);

    const headers = {
      "content-type": "application/json",
    };

    try {
      // Check if the action is `start`.
      if (action === "start") {
        // Get the data from the noops challenge api.
        const data = await axios.post<AdventureInt>(
          "https://api.noopschallenge.com/pathbot/start",
          {},
          {
            headers,
          }
        );

        // Add the adventure information to the embed.
        adventureEmbed = addInfoToEmbed(prefix, data.data, adventureEmbed);
      }
      // Otherwise, the action is `move`.
      else {
        // Get the next argument as the room.
        const room = commandArguments.shift();

        // Check if the room is not valid.
        if (!room) {
          await message.reply("sorry, but you must enter the room id.");
          return;
        }

        // Get the next argument as the direction.
        const direction = commandArguments.shift();

        // Check if the direction is not valid.
        if (!direction) {
          await message.reply("sorry, but you must enter the direction.");
          return;
        }

        // Get the data from the noops challenge api.
        const data = await axios.post<AdventureInt>(
          `https://api.noopschallenge.com/pathbot/rooms/${room}`,
          {
            direction: direction.toUpperCase(),
          },
          {
            headers,
          }
        );

        // Add the adventure information to the embed.
        adventureEmbed = addInfoToEmbed(prefix, data.data, adventureEmbed);
      }
    } catch (error) {
      console.log(
        "Adventure command:",
        error?.response?.data?.message ?? "Unknown error."
      );

      // Send an error message to the current channel.
      await message.reply(
        `sorry, but I cannot execute the \`${action}\` action inside the adventure.`
      );

      return;
    }

    // Send the embed to the current channel.
    await channel.send(adventureEmbed);
  },
};

export default adventure;
