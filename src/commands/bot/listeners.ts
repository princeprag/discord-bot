import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const LISTENERS_CONSTANT = {
  title: "I am always listening...",
  description:
    "For my spells to work, I have sentinels that listen to every message in the server. I check each message to see if you have called for my assistance. But did you know my sentinels observe other events? Here's what they are:",
};

const listeners: CommandInt = {
  name: "listeners",
  description:
    "Provides information on the active listener features for Becca.",
  category: "bot",
  run: async (message) => {
    try {
      const { Becca, channel } = message;

      // Create a new empty embed.
      const listenerEmbed = new MessageEmbed();

      // Add the light purple color.
      listenerEmbed.setColor(Becca.color);

      // Add the title.
      listenerEmbed.setTitle(LISTENERS_CONSTANT.title);

      // Add the description.
      listenerEmbed.setDescription(LISTENERS_CONSTANT.description);

      // Create list of UNIQUE listeners
      const listenerList = Object.values(Becca.customListeners);
      const listeners = listenerList.filter(
        (l, i, self) => self.findIndex((el) => el.name === l.name) === i
      );

      // Add the listeners to fields.
      for (const listener of listeners) {
        listenerEmbed.addField(listener.name, listener.description);
      }

      // Send the embed to the current channel.
      await channel.send(listenerEmbed);
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "listeners command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default listeners;
