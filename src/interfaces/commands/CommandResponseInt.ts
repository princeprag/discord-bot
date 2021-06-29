import { MessageEmbed } from "discord.js";

export interface CommandResponseInt {
  success: boolean;
  content: string | MessageEmbed;
}
