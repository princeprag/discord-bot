import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const LISTENERS_CONSTANT = {
  title: "I am always listening...",
  description:
    "For my commands to work, I have to listen to every message in the server. I check each message to see if you have called for my assistance. But did you know I also listen for other events? Here's what they are!",
};

const listeners: CommandInt = {
  name: "listeners",
  description:
    "Provides information on the active listener features for the bot.",
  run: async (message) => {
    try {
      const { bot, channel } = message;

      // Create a new empty embed.
      const listenerEmbed = new MessageEmbed();

      // Add the light purple color.
      listenerEmbed.setColor(bot.color);

      // Add the title.
      listenerEmbed.setTitle(LISTENERS_CONSTANT.title);

      // Add the description.
      listenerEmbed.setDescription(LISTENERS_CONSTANT.description);

      // Create list of UNIQUE listeners
      const listenerList = Object.values(bot.customListeners);
      const listeners = listenerList.filter(
        (l, i, self) => self.findIndex((el) => el.name === l.name) === i
      );

      // Add the listeners to fields.
      for (const listener of listeners) {
        listenerEmbed.addField(listener.name, listener.description);
      }

      // Send the embed to the current channel.
      await channel.send(listenerEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the listeners command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default listeners;
