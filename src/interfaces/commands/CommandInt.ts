import { Message } from "discord.js";
import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";
import { CommandResponseInt } from "./CommandResponseInt";

/**
 * Defines the structure for Becca's commands.
 * @property name - String used to call the command.
 * @property description - String used to describe what the command does.
 * @property parameters - Array of strings indicating: "`parameter`: purpose"
 * @property category - String indicating which category the command falls under.
 * @function run - Executes the command logic. Should take Becca and message, with optional server config, and return string or embed.
 */
export interface CommandInt {
  name: string;
  description: string;
  parameters: string[];
  category: "bot" | "game" | "general" | "mod" | "server";
  run: (
    Becca: BeccaInt,
    message: Message,
    config: ServerModelInt
  ) => Promise<CommandResponseInt>;
}
