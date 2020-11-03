import ListenerInt from "@Interfaces/ListenerInt";
import SettingModel from "@Models/SettingModel";
import { love as defaultLovesIDs } from "../../default_config.json";

const heartReactions = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍"];

/**
 * React with a heart to specific users messages.
 * @constant
 */
const heartsListener: ListenerInt = {
  name: "Love",
  description: "Gives love to specific users.",
  run: async (message) => {
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
      const lovesSetting = await SettingModel.findOne({
        server_id: guild.id,
        key: "loves",
      });

      // Check if the custom loves are valid.
      if (lovesSetting) {
        authors = authors.concat(lovesSetting.value.split(","));
      }

      // Check if the message author id is in the loves user ids.
      if (authors.includes(author.id)) {
        // Get a random heart reaction.
        const randomHeartReaction = ~~(
          Math.random() * heartReactions.length -
          1
        );

        // Check if the message is not deleted.
        if (!message.deleted) {
          // React to the user message.
          await message.react(heartReactions[randomHeartReaction]);
        }
      }
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the hearts listener:`
      );
      console.log(error);
    }
  },
};

export default heartsListener;
