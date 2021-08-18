import { BeccaInt, ResponsesInt } from "../interfaces/BeccaInt";

/**
 * Function to validate that all environment variables are present. Loads those
 * environment variables into Becca's Client instance. Also loads the colours and responses.
 * @param Becca Becca's Client object
 * @returns Object containing a valid property as boolean, and a message as string.
 */
export const validateEnv = (
  Becca: BeccaInt
): { valid: boolean; message: string } => {
  try {
    if (!process.env.DISCORD_TOKEN) {
      return { valid: false, message: "Missing Discord token!" };
    }

    if (!process.env.MONGODB) {
      return { valid: false, message: "Missing database connection string" };
    }

    if (!process.env.WH_URL) {
      return { valid: false, message: "Missing Discord webhook URL" };
    }

    if (!process.env.NASA_API) {
      return { valid: false, message: "Missing NASA API key" };
    }

    if (!process.env.OWNER_ID) {
      return { valid: false, message: "Missing Discord ID for owner account" };
    }

    if (!process.env.CLIENT_ID) {
      return { valid: false, message: "Missing Bot's Client ID" };
    }

    if (!process.env.HOME_GUILD_ID) {
      return { valid: false, message: "Missing Bot's Home Guild ID" };
    }

    const configs = {
      token: process.env.DISCORD_TOKEN,
      dbToken: process.env.MONGODB,
      whUrl: process.env.WH_URL,
      nasaKey: process.env.NASA_API,
      ownerId: process.env.OWNER_ID,
      love: process.env.BECCA_LOVE || "💜",
      yes: process.env.BECCA_YES || "✅",
      no: process.env.BECCA_NO || "❌",
      think: process.env.BECCA_THINK || "🤔",
      version: process.env.npm_package_version || "null",
      id: process.env.CLIENT_ID,
      homeGuild: process.env.HOME_GUILD_ID,
    };

    Becca.configs = configs;

    const colours = {
      default: 0x8b4283,
      success: 0x1f8b4c,
      warning: 0xc27c0e,
      error: 0x992d22,
    };

    Becca.colours = colours;

    const phrases: ResponsesInt = {
      missing_guild: "It seems I cannot locate your guild record.",
      invalid_command:
        "I am not sure how this happened, but that spell does not appear to be valid.",
      no_permission: "You do not have the correct skills to use this spell.",
      owner_only: "Only my owner can ask me to do this.",
      missing_param:
        "This is impressive. You have managed to forget a required component for this spell.",
      default_mod_reason:
        "Unfortunately, they could not be bothered to tell me why.",
      no_mod_becca:
        "Brave of you to try to make me your target. Foolish, but brave.",
      no_mod_self: "Are... are you asking me to smite you?",
    };

    Becca.responses = phrases;

    return { valid: true, message: "Environment variables validated!" };
  } catch (err) {
    return {
      valid: false,
      message: "Unknown error when validating environment",
    };
  }
};
