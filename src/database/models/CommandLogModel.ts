import { Document, model, Schema } from "mongoose";
import encrypt from "mongoose-encryption";
export interface CommandLogInt extends Document {
  commandName: string;
  uses: number;
  lastUsed: Date;
  lastUser: string;
  servers: {
    serverID: string;
    serverName: string;
    serverUses: number;
    serverLastUsed: Date;
    serverLastUser: string;
  }[];
}

export const CommandLog = new Schema({
  commandName: String,
  uses: Number,
  lastUsed: Date,
  lastUser: String,
  servers: [Object],
});

const encryptionKey = process.env.ENCRYPTION_KEY;
const signingKey = process.env.SIGNING_KEY;

CommandLog.plugin(encrypt, {
  encryptionKey,
  signingKey,
  excludeFromEncryption: ["commandName"],
  requireAuthenticationCode: false,
});

export default model<CommandLogInt>("command_log", CommandLog);
