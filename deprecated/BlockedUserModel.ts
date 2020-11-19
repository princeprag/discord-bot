import { Document, model, Schema } from "mongoose";

export interface BlockedUserInt extends Document {
  userId: string;
  username: string;
}

export const blockedUser = new Schema({
  userId: String,
  Username: String,
});

export default model<BlockedUserInt>("blockedUser", blockedUser);
