import { Document, model, Schema } from "mongoose";

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

export default model<StarCountInt>("StarCount", StarCount);
