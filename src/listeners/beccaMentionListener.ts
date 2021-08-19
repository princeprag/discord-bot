import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const beccaMentionListener: ListenerInt = {
  name: "Becca Mention Listener",
  description: "Listens for Becca being mentioned.",
  run: async (Becca, message) => {
    try {
      const { channel, guild, mentions } = message;
      if (!guild || !Becca.user || !mentions.users?.has(Becca.user.id)) {
        return;
      }

      await message.react(Becca.configs.think);
      await channel.send(
        "What can I do for you? Cast `becca!help` to see my spells!"
      );
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "mention listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
