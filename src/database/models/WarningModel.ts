import { Document, model, Schema } from "mongoose";
import encrypt from "mongoose-encryption";

export interface WarningInt extends Document {
  serverID: string;
  serverName: string;
  users: {
    userID: string;
    userName: string;
    lastWarnText: string;
    lastWarnDate: number;
    warnCount: number;
  }[];
}

export const Warning = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

const encryptionKey = process.env.ENCRYPTION_KEY;
const signingKey = process.env.SIGNING_KEY;

Warning.plugin(encrypt, {
  encryptionKey,
  signingKey,
  excludeFromEncryption: ["serverID"],
  requireAuthenticationCode: false,
});

export default model<WarningInt>("warning", Warning);
