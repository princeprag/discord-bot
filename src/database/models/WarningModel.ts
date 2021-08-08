import { Document, model, Schema } from "mongoose";

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

export default model<WarningInt>("warning", Warning);
