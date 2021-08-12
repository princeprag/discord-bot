import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ServerModelInt } from "../../database/models/ServerModel";
import { BeccaInt } from "../BeccaInt";

export interface SlashInt {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandGroupsOnlyBuilder;
  run: (
    Becca: BeccaInt,
    interaction: CommandInteraction,
    config: ServerModelInt
  ) => Promise<void>;
}
