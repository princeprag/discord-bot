import * as Sentry from "@sentry/node";
import { Message, MessageEmbed } from "discord.js";
import { Types } from "mongoose";
import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaLogHandler } from "./beccaLogHandler";
import { customSubstring } from "./customSubstring";

/**
 * Automated error handler to pass errors to Sentry and the logger.
 * @param Becca Becca's Client object
 * @param context The string explaining where this error was thrown.
 * @param err The standard error object (generated in a catch statement)
 * @param guild The name of the guild that triggered the issue.
 * @param message Optional message that triggered the issue.
 */
export const beccaErrorHandler = async (
  Becca: BeccaInt,
  context: string,
  err: unknown,
  guild?: string,
  message?: Message
): Promise<Types.ObjectId> => {
  const error = err as Error;
  beccaLogHandler.log("error", `There was an error in the ${context}:`);
  beccaLogHandler.log(
    "error",
    JSON.stringify({ errorMessage: error.message, errorStack: error.stack })
  );

  Sentry.captureException(error);

  const errorId = new Types.ObjectId();
  const errorEmbed = new MessageEmbed();
  errorEmbed.setTitle(
    `${context} error ${guild ? "in " + guild : "from an unknown source"}.`
  );
  errorEmbed.setColor(Becca.colours.error);
  errorEmbed.setDescription(customSubstring(error.message, 2000));
  errorEmbed.addField(
    "Stack Trace:",
    `\`\`\`\n${customSubstring(error.stack || "null", 1000)}\n\`\`\``
  );
  errorEmbed.addField("Error ID", errorId.toHexString());
  errorEmbed.setTimestamp();
  if (message) {
    errorEmbed.addField(
      "Message Content:",
      customSubstring(message.content, 1000)
    );
  }
  await Becca.debugHook.send({ embeds: [errorEmbed] });

  return errorId;
};
