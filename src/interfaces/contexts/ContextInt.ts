import { ContextMenuInteraction } from "discord.js";
import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";

export interface ContextInt {
  data: {
    name: string;
    type: 2 | 3;
  };
  run: (
    Becca: BeccaInt,
    interaction: ContextMenuInteraction,
    config: ServerModelInt
  ) => Promise<void>;
}
