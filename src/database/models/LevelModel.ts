import { Document, model, Schema } from "mongoose";
import encrypt from "mongoose-encryption";

export interface LevelInt extends Document {
  serverID: string;
  serverName: string;
  users: {
    userID: string;
    userName: string;
    points: number;
    lastSeen: Date;
    cooldown: number;
  }[];
}

export const Level = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

const encryptionKey = process.env.ENCRYPTION_KEY;
const signingKey = process.env.SIGNING_KEY;

Level.plugin(encrypt, {
  encryptionKey,
  signingKey,
  excludeFromEncryption: ["serverID"],
  requireAuthenticationCode: false,
});

export default model<LevelInt>("level", Level);
