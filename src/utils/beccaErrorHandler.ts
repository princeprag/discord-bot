import * as Sentry from "@sentry/node";
import { WebhookClient } from "discord.js";
import MessageInt from "../interfaces/MessageInt";
import { beccaLogger } from "./beccaLogger";

export const beccaErrorHandler = async (
  error: unknown,
  guild: string,
  event: string,
  debugHook?: WebhookClient,
  message?: MessageInt
): Promise<void> => {
  if (debugHook) {
    await debugHook.send(
      `${guild} had an error with the ${event}. Please check the logs.`
    );
  }

  if (message) {
    await message.react(message.Becca.no);
    await message.reply("Sorry, but I cannot do that right now.");
  }

  beccaLogger.log(
    "error",
    `${guild} had the following error with the ${event}:`
  );
  beccaLogger.log("error", error);
  Sentry.captureException(error);
};
