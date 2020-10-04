import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const listeners: CommandInt = {
  names: ["listen", "listeners"],
  description:
    "Provides information on the active listener features for the bot.",
  run: async (message) => {
    const { bot, channel } = message;

    // Create a new empty embed.
    const listeners = new MessageEmbed();

    // Add the light purple color.
    listeners.setColor(bot.color);

    // Add the title.
    listeners.setTitle("I am always listening...");

    // Add the description.
    listeners.setDescription(
      "For my commands to work, I have to listen to every message in the server. I check each message to see if you have called for my assistance. But did you know I also listen for other events? Here's what they are!"
    );

    // Add the listeners to fields.
    for (const listener of Object.values(bot.customListeners)) {
      listeners.addField(listener.name, listener.description);
    }

    // Send the embed to the current channel.
    await channel.send(listeners);
  },
};

export default listeners;
