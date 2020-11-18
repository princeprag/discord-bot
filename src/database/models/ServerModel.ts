import { Document, model, Schema } from "mongoose";

export interface ServerModelInt extends Document {
  serverID: string;
  serverName: string;
  prefix: string;
  thanks: string;
  levels: string;
  welcome_channel: string;
  log_channel: string;
  restricted_role: string;
  moderator_role: string;
  custom_welcome: string;
  hearts: string[];
  blocked: string[];
}

export const Server = new Schema({
  serverID: String,
  serverName: String,
  prefix: String,
  thanks: String,
  levels: String,
  welcome_channel: String,
  log_channel: String,
  restricted_role: String,
  moderator_role: String,
  custom_welcome: String,
  hearts: [Object],
  blocked: [Object],
});

export default model<ServerModelInt>("server", Server);
