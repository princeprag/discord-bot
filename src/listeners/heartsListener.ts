import { defaultHearts } from "../config/listeners/defaultHearts";
import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const heartsListener: ListenerInt = {
  name: "Hearts Listener",
  description: "Adds heart reactions to specified users.",
  run: async (Becca, message, config) => {
    try {
      const { author } = message;
      const usersToHeart = defaultHearts.concat(config.hearts);
      if (usersToHeart.includes(author.id) && !message.deleted) {
        await message.react(Becca.configs.love);
      }
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "hearts listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
