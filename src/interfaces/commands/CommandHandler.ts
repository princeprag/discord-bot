import { CommandInteraction } from "discord.js";

import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {CommandInteraction} interaction The interaction payload from Discord.
 * @param {ServerModelInt} config The settings for the server where the interaction occurred.
 */
export type CommandHandler = (
  Becca: BeccaInt,
  interaction: CommandInteraction,
  config: ServerModelInt
) => Promise<void>;
