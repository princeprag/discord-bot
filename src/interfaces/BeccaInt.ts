import { Client, WebhookClient } from "discord.js";
import { CommandInt } from "./commands/CommandInt";

/**
 * Model used to pass around Becca's client instance with additional
 * configurations attached.
 * @property prefixData The data for server-specific prefixes.
 * @property debugHook The Discord Webhook Client for the error handler.
 * @property configs A map of the environment variables, assigned after validation.
 * @property colours Colour mappings to use in embeds.
 */
export interface BeccaInt extends Client {
  prefixData: Record<string, string>;
  debugHook: WebhookClient;
  configs: {
    token: string;
    dbToken: string;
    hookId: string;
    hookToken: string;
    nasaKey: string;
    habiticaKey: string;
    orbitKey: string;
    ownerId: string;
    love: string;
    yes: string;
    no: string;
    think: string;
    version: string;
  };
  colours: {
    default: string;
    success: string;
    warning: string;
    error: string;
  };
  commands: CommandInt[];
}
