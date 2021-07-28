import { MessageEmbed, ThreadChannel } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const threadDelete = async (
  Becca: BeccaInt,
  thread: ThreadChannel
): Promise<void> => {
  try {
    const threadEmbed = new MessageEmbed();
    threadEmbed.setTitle("Thread Deleted");
    threadEmbed.setDescription(
      `The thread ${thread.name} in the ${thread.parent?.name} channel was deleted.`
    );
    threadEmbed.setColor(Becca.colours.error);
    threadEmbed.setFooter(`ID: ${thread.id}`);
    threadEmbed.setTimestamp();

    await sendLogEmbed(Becca, thread.guild, threadEmbed);
  } catch (err) {
    beccaErrorHandler(Becca, "thread delete event", err);
  }
};
