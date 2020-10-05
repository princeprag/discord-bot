import { Document, model, Schema } from "mongoose";

export interface CommandLogIntOptional {
  uses: number;
  last_called: number;
}

export interface CommandLogIntRequired {
  command: string;
  server_id: string;
  last_caller: string;
}

export interface CommandLogInt
  extends Document,
    CommandLogIntOptional,
    CommandLogIntRequired {}

const commandLog = new Schema({
  command: String,
  uses: {
    type: Number,
    default: 1,
  },
  server_id: {
    type: String,
    required: true,
  },
  last_called: {
    type: Date,
    default: Date.now,
  },
  last_caller: {
    type: String,
    required: true,
  },
});

export default model<CommandLogInt>("command_log", commandLog);
