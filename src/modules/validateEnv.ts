import { BeccaInt } from "../interfaces/BeccaInt";

/**
 * Function to validate that all environment variables are present. Loads those
 * environment variables into Becca's Client instance. Also loads the colours.
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

    if (!process.env.WH_ID || !process.env.WH_TOKEN) {
      return { valid: false, message: "Missing Discord webhook credentials" };
    }

    if (!process.env.NASA_API) {
      return { valid: false, message: "Missing NASA API key" };
    }

    if (!process.env.HABITICA_KEY) {
      return { valid: false, message: "Missing Habitica API key" };
    }

    if (!process.env.ORBIT_KEY) {
      return { valid: false, message: "Missing Orbit API key" };
    }

    if (!process.env.OWNER_ID) {
      return { valid: false, message: "Missing Discord ID for owner account" };
    }

    const configs = {
      token: process.env.DISCORD_TOKEN,
      dbToken: process.env.MONGODB,
      hookId: process.env.WH_ID as `${bigint}`,
      hookToken: process.env.WH_TOKEN,
      nasaKey: process.env.NASA_API,
      habiticaKey: process.env.HABITICA_KEY,
      orbitKey: process.env.ORBIT_KEY,
      ownerId: process.env.OWNER_ID,
      love: process.env.BECCA_LOVE || "💜",
      yes: process.env.BECCA_YES || "✅",
      no: process.env.BECCA_NO || "❌",
      think: process.env.BECCA_THINK || "🤔",
      version: process.env.npm_package_version || "null",
    };

    Becca.configs = configs;

    const colours = {
      default: 0x8b4283,
      success: 0x1f8b4c,
      warning: 0xc27c0e,
      error: 0x992d22,
    };

    Becca.colours = colours;

    return { valid: true, message: "Environment variables validated!" };
  } catch (err) {
    return {
      valid: false,
      message: "Unknown error when validating environment",
    };
  }
};
