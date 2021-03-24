import ListenerInt from "../interfaces/ListenerInt";
import { love as defaultLovesIDs } from "../../default_config.json";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

/**
 * React with a heart to specific users messages.
 * @constant
 */
const heartsListener: ListenerInt = {
  name: "Love",
  description: "Gives love to specific users.",
  run: async (message, config) => {
    try {
      // Get the current guild from the message.
      const { author, guild } = message;

      // Check if is a valid guild.
      if (!guild) {
        return;
      }

      // Set the default loves user ids.
      let authors = defaultLovesIDs;

      // Get the custom loves from the database.
      const lovesSetting = config.hearts;

      // Check if the custom loves are valid.
      if (lovesSetting) {
        authors = authors.concat(lovesSetting);
      }

      // Check if the message author id is in the loves user ids.
      if (authors.includes(author.id)) {
        // Check if the message is not deleted.
        if (!message.deleted) {
          // React to the user message.
          await message.react(message.Becca.love);
        }
      }
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "hearts listener",
        message.Becca.debugHook
      );
    }
  },
};

export default heartsListener;
