import { Document, model, Schema } from "mongoose";

export interface LevelInt extends Document {
  serverID: string;
  serverName: string;
  users: {
    userID: string;
    userName: string;
    points: number;
    level: number;
    lastSeen: Date;
    cooldown: number;
  }[];
}

export const Level = new Schema({
  serverID: String,
  serverName: String,
  users: [],
});

export default model<LevelInt>("level", Level);
