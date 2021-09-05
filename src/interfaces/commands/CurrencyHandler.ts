import { CommandInteraction } from "discord.js";

import { CurrencyInt } from "../../database/models/CurrencyModel";
import { BeccaInt } from "../BeccaInt";

/**
 * Handles the logic for the currency commands.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {CommandInteraction} interaction The interaction payload from Discord.
 * @param {CurrencyInt} data The user's currency record from the database.
 */
export type CurrencyHandler = (
  Becca: BeccaInt,
  interaction: CommandInteraction,
  data: CurrencyInt
) => Promise<void>;
