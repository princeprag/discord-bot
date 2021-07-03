import { Message, MessageEmbed } from "discord.js";
import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { sleep } from "../utils/sleep";

/**
 * Module to handle when the guild property is missing, indicating the message
 * is likely coming from a DM.
 * @param {BeccaInt} Becca Becca's client instance.
 * @param {Message} message The message object.
 */
export const handleDms = async (
  Becca: BeccaInt,
  message: Message
): Promise<void> => {
  try {
    const dmEmbed = new MessageEmbed();
    dmEmbed.setTitle("Please find a guild.");
    dmEmbed.setDescription(
      "Hello. I like my privacy, and do not handle things in DMs. It appears this is a direct message. You should interact with me in your guild instead."
    );
    dmEmbed.setColor(Becca.colours.default);
    dmEmbed.addField(
      "Join my support server",
      "http://chat.nhcarrigan.com",
      true
    );
    dmEmbed.addField(
      "Invite me to your guild",
      "http://invite.beccalyria.com",
      true
    );
    message.channel.startTyping();
    await sleep(3000);
    message.channel.stopTyping();
    await message.reply(dmEmbed);
  } catch (err) {
    beccaErrorHandler(Becca, "handleDMs module", err, "no guild", message);
  }
};
