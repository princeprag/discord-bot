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
    try {
      const { author, Becca, channel, commandArguments, guild } = message;

      const { color, prefix } = Becca;

      if (!guild) {
        return;
      }

      // Get the next argument as the action.
      const action = commandArguments.shift();

      // Check if the action is not `start` and `move`.
      if (action !== "start" && action !== "move") {
        await message.reply(
          `Would you please use \`${prefix[guild.id]}adventure start\` or \`${
            prefix[guild.id]
          }adventure move <room> <direction>\`?`
        );

        return;
      }

      // Create a new empty embed.
      let adventureEmbed = new MessageEmbed();

      // Add the light purple color.
      adventureEmbed.setColor(color);

      // Set the title.
      adventureEmbed.setTitle(`${author.username}'s adventure!`);

      const headers = {
        "content-type": "application/json",
      };

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
        adventureEmbed = addInfoToEmbed(
          prefix[guild.id],
          data.data,
          adventureEmbed
        );
      }
      // Otherwise, the action is `move`.
      else {
        // Get the next argument as the room.
        const room = commandArguments.shift();

        // Check if the room is not valid.
        if (!room) {
          await message.reply(
            "Would you please try the command again, and enter the room id?"
          );
          return;
        }

        // Get the next argument as the direction.
        const direction = commandArguments.shift();

        // Check if the direction is not valid.
        if (!direction) {
          await message.reply(
            "Would you please try the command again, and enter the direction?"
          );
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
        adventureEmbed = addInfoToEmbed(
          prefix[guild.id],
          data.data,
          adventureEmbed
        );
      }

      // Send the embed to the current channel.
      await channel.send(adventureEmbed);
      await message.react("791758203145945128");
    } catch (error) {
      await message.react("791758203204796446");
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the adventure command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the adventure command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default adventure;
