import { Document, model, Schema } from "mongoose";
import encrypt from "mongoose-encryption";

export interface ServerModelInt extends Document {
  serverID: string;
  serverName: string;
  prefix: string;
  thanks: string;
  levels: string;
  welcome_channel: string;
  log_channel: string;
  suggestion_channel: string;
  restricted_role: string;
  moderator_role: string;
  custom_welcome: string;
  hearts: string[];
  blocked: string[];
  self_roles: string[];
}

export const Server = new Schema({
  serverID: String,
  serverName: String,
  prefix: String,
  thanks: String,
  levels: String,
  welcome_channel: String,
  log_channel: String,
  suggestion_channel: {
    type: String,
    default: "",
  },
  restricted_role: String,
  moderator_role: String,
  custom_welcome: String,
  hearts: [String],
  blocked: [String],
  self_roles: [String],
});

const encryptionKey = process.env.ENCRYPTION_KEY;
const signingKey = process.env.SIGNING_KEY;

Server.plugin(encrypt, {
  encryptionKey,
  signingKey,
  excludeFromEncryption: ["serverID"],
  requireAuthenticationCode: false,
});

export default model<ServerModelInt>("server", Server);
