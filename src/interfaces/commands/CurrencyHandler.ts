import { CommandInteraction } from "discord.js";
import { CurrencyInt } from "../../database/models/CurrencyModel";
import { BeccaInt } from "../BeccaInt";

export type CurrencyHandler = (
  Becca: BeccaInt,
  interaction: CommandInteraction,
  data: CurrencyInt
) => Promise<void>;
