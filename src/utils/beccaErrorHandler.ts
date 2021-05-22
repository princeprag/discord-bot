import * as Sentry from "@sentry/node";
import { MessageEmbed, WebhookClient } from "discord.js";
import MessageInt from "../interfaces/MessageInt";
import { beccaLogger } from "./beccaLogger";
import { customSubstring } from "./substringHelper";

export const beccaErrorHandler = async (
  error: Error,
  guild: string,
  event: string,
  debugHook?: WebhookClient,
  message?: MessageInt
): Promise<void> => {
  if (debugHook) {
    const errorEmbed = new MessageEmbed();
    errorEmbed.setTitle(`${event} error in ${guild}`);
    errorEmbed.setColor("#AB47E6");
    errorEmbed.setDescription(customSubstring(error.message, 2000));
    errorEmbed.addField(
      "Stack Trace:",
      `\`\`\`\n${customSubstring(error.stack || "null", 1000)}\n\`\`\``
    );
    errorEmbed.setTimestamp();
    if (message) {
      errorEmbed.addField(
        "Message Content:",
        customSubstring(message.content, 1000)
      );
    }
    await debugHook.send(errorEmbed);
  }

  if (message) {
    await message.react(message.Becca.no);
    await message.channel.send(
      "That spell seems to have failed. Not sure why."
    );
  }

  beccaLogger.log(
    "error",
    `${guild} had the following error with the ${event}:`
  );
  beccaLogger.log(
    "error",
    JSON.stringify({ errorMessage: error.message, errorStack: error.stack })
  );
  if (message) {
    beccaLogger.log("info", "Message content: " + message.content);
  }
  Sentry.captureException(error);
};
