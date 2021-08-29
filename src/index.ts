import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import { beccaLogHandler } from "./utils/beccaLogHandler";
import { Client, WebhookClient } from "discord.js";
import { BeccaInt } from "./interfaces/BeccaInt";
import { validateEnv } from "./modules/validateEnv";
import { connectDatabase } from "./database/connectDatabase";
import { beccaErrorHandler } from "./utils/beccaErrorHandler";
import { handleEvents } from "./events/handleEvents";
import { loadCommands } from "./utils/loadCommands";
import { createServer } from "./server/serve";
import { IntentOptions } from "./config/IntentOptions";

/**
 * This block initialises the Sentry plugin.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

/**
 * Initialise spinner for logging
 * @property add(name, {color, text}) Add a new spinner
 * @property update(name, {color, text}) Update an existing spinner
 * @property fail(name, {text}) Set a spinner to fail state
 * @property succeed(name, {text}) Set a spinner to success state
 */

/**
 * Function to initialise the bot application.
 */
const initialiseBecca = async () => {
  beccaLogHandler.log("debug", "Starting process...");

  const Becca = new Client({
    shards: "auto",
    intents: IntentOptions,
  }) as BeccaInt;

  beccaLogHandler.log("debug", "Validating environment variables...");
  const validatedEnvironment = validateEnv(Becca);
  if (!validatedEnvironment.valid) {
    beccaLogHandler.log("error", validatedEnvironment.message);
    return;
  }

  Becca.debugHook = new WebhookClient({ url: Becca.configs.whUrl });
  Becca.currencyHook = new WebhookClient({ url: Becca.configs.currencyUrl });

  beccaLogHandler.log("debug", "Initialising web server...");
  const server = await createServer(Becca);
  if (!server) {
    beccaLogHandler.log("error", "failed to launch web server.");
    return;
  }

  beccaLogHandler.log("debug", "Importing commands...");
  const commands = await loadCommands(Becca);
  Becca.commands = commands;
  if (!commands.length) {
    beccaLogHandler.log("error", "failed to import commands.");
    return;
  }

  beccaLogHandler.log("debug", "Initialising database...");
  const databaseConnection = await connectDatabase(Becca);
  if (!databaseConnection) {
    beccaLogHandler.log("error", "failed to connect to database.");
    return;
  }

  beccaLogHandler.log("debug", "Attaching event listeners...");
  await handleEvents(Becca);

  beccaLogHandler.log("debug", "Connecting to Discord...");
  await Becca.login(Becca.configs.token);
  beccaLogHandler.log("debug", "Setting activity...");
  Becca.user?.setActivity("for people who need my `/help`~!", {
    type: "WATCHING",
  });

  /**
   * Fallthrough error handlers. These fire in rare cases where something throws
   * in a way that our standard catch block cannot see it.
   */
  process.on("unhandledRejection", async (error: Error) => {
    await beccaErrorHandler(Becca, "Unhandled Rejection Error", error);
  });

  process.on("uncaughtException", async (error) => {
    await beccaErrorHandler(Becca, "Uncaught Exception Error", error);
  });
};

initialiseBecca();
