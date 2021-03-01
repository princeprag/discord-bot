import { Document, model, Schema } from "mongoose";
import encrypt from "mongoose-encryption";

export interface StarCountInt extends Document {
  serverID: string;
  serverName: string;
  users: {
    userID: string;
    userName: string;
    stars: number;
  }[];
}

export const StarCount = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

const encryptionKey = process.env.ENCRYPTION_KEY;
const signingKey = process.env.SIGNING_KEY;

StarCount.plugin(encrypt, {
  encryptionKey,
  signingKey,
  excludeFromEncryption: ["serverID"],
  requireAuthenticationCode: false,
});

export default model<StarCountInt>("StarCount", StarCount);
