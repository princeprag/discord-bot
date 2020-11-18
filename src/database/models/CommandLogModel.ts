import { Document, model, Schema } from "mongoose";

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

export default model<CommandLogInt>("command_log", CommandLog);
