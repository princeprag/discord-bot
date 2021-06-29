import { Message, MessageEmbed } from "discord.js";
import { BeccaInt } from "../BeccaInt";

/**
 * Defines the structure for Becca's commands.
 * @property name - String used to call the command.
 * @property description - String used to describe what the command does.
 * @property parameters - Array of strings indicating: "`parameter`: purpose"
 * @property category - String indicating which category the command falls under.
 * @function run - Executes the command logic. Should take Becca and message, and return string or embed.
 */
export interface CommandInt {
  name: string;
  description: string;
  parameters: string[];
  category: string;
  run: (Becca: BeccaInt, message: Message) => Promise<string | MessageEmbed>;
}
