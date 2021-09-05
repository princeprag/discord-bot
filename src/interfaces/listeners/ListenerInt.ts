import { Message } from "discord.js";

import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";

export interface ListenerInt {
  name: string;
  description: string;
  /**
   * Handles the logic for a given listener.
   *
   * @param {BeccaInt} Becca Becca's Discord instance.
   * @param {Message} message The message that triggered the listener.
   * @param {ServerModelInt} config The server settings from the database.
   */
  run: (
    Becca: BeccaInt,
    message: Message,
    config: ServerModelInt
  ) => Promise<void>;
}
