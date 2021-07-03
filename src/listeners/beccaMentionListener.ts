import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { sleep } from "../utils/sleep";

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
      channel.startTyping();
      await sleep(3000);
      channel.stopTyping();
      await channel.send(
        `What can I do for you? Cast \`${
          Becca.prefixData[guild.id]
        }help\` to see my spells.`
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
