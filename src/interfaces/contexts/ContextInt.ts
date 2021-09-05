import { ContextMenuInteraction } from "discord.js";

import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";

export interface ContextInt {
  data: {
    name: string;
    type: 2 | 3;
  };
  /**
   * Handles the logic for a given context menu interaction.
   *
   * @param {BeccaInt} Becca Becca's Discord instance.
   * @param {ContextMenuInteraction} interaction The context menu interaction payload.
   * @param {ServerModelInt} config The server's settings from the database.
   */
  run: (
    Becca: BeccaInt,
    interaction: ContextMenuInteraction,
    config: ServerModelInt
  ) => Promise<void>;
}
