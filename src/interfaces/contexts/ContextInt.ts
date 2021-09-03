import { ContextMenuInteraction } from "discord.js";
import { BeccaInt } from "../BeccaInt";

export interface ContextInt {
  data: {
    name: string;
    type: 2 | 3;
  };
  run: (Becca: BeccaInt, interaction: ContextMenuInteraction) => Promise<void>;
}
