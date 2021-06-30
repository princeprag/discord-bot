import { Message } from "discord.js";
import { BeccaInt } from "../BeccaInt";

export interface ListenerInt {
  name: string;
  description: string;
  run: (Becca: BeccaInt, message: Message) => Promise<void>;
}
