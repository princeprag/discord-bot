import { Message } from "discord.js";
import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";

export interface ListenerInt {
  name: string;
  description: string;
  run: (
    Becca: BeccaInt,
    message: Message,
    config: ServerModelInt
  ) => Promise<void>;
}
