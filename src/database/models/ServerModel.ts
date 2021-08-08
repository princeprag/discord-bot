import { Document, model, Schema } from "mongoose";
import { LevelRoleInt } from "../../interfaces/settings/LevelRoleInt";

export interface ServerModelInt extends Document {
  serverID: string;
  serverName: string;
  prefix: string;
  thanks: string;
  levels: string;
  welcome_channel: string;
  log_channel: string;
  level_channel: string;
  suggestion_channel: string;
  muted_role: string;
  custom_welcome: string;
  hearts: string[];
  blocked: string[];
  self_roles: string[];
  anti_links: string[];
  permit_links: string[];
  link_roles: string[];
  allowed_links: string[];
  link_message: string;
  level_roles: LevelRoleInt[];
}

export const Server = new Schema({
  serverID: String,
  serverName: String,
  prefix: String,
  thanks: String,
  levels: String,
  welcome_channel: String,
  log_channel: String,
  level_channel: String,
  suggestion_channel: {
    type: String,
    default: "",
  },
  muted_role: String,
  custom_welcome: String,
  hearts: [String],
  blocked: [String],
  self_roles: [String],
  anti_links: [String],
  permit_links: [String],
  link_roles: [String],
  allowed_links: [String],
  link_message: String,
  level_roles: [Object],
});

export default model<ServerModelInt>("server", Server);
