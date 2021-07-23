import { MessageEmbed } from "discord.js";
import { Types } from "mongoose";
import { BeccaInt } from "../../interfaces/BeccaInt";

export const errorEmbedGenerator = (
  Becca: BeccaInt,
  commandName: string,
  errorId: Types.ObjectId
): MessageEmbed => {
  const errorEmbed = new MessageEmbed();
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setTitle(`Unknown Error`);
  errorEmbed.setDescription(`The ${commandName} spell has fizzled out.`);
  errorEmbed.addField(
    "What happened?",
    "Something went wrong with this command."
  );
  errorEmbed.addField(
    "Did I do something wrong?",
    "Errors can happen for a number of reasons. It could be an issue with the permissions you gave me, the code that powers me, or a number of other possibilities."
  );
  errorEmbed.addField(
    "So what can I do to fix it?",
    " If you need assistance with this feature, please [join our support server](https://chat.nhcarrigan.com). Once there, give this ErrorID to the support team to investigate."
  );
  errorEmbed.addField("Error ID:", errorId);
  errorEmbed.setTimestamp();
  return errorEmbed;
};
