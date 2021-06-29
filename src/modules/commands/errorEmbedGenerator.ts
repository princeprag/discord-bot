import { MessageEmbed } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";

export const errorEmbedGenerator = (
  Becca: BeccaInt,
  commandName: string
): MessageEmbed => {
  const errorEmbed = new MessageEmbed();
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setTitle(`Unknown Error`);
  errorEmbed.setDescription(
    `The ${commandName} command has caused an unknown error. Please contact the developer.`
  );
  errorEmbed.setTimestamp();
  return errorEmbed;
};
