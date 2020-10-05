import { Document, model, Schema } from "mongoose";

export interface UserIntOptional {
  points: number;
  last_seen: number;
}

export interface UserIntRequired {
  name: string;
  server_id: string;
  user_id: string;
}

export interface UserInt extends Document, UserIntOptional, UserIntRequired {}

const user = new Schema({
  name: String,
  points: {
    type: Number,
    default: 1,
  },
  server_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  last_seen: {
    type: Date,
    default: Date.now,
  },
});

export default model<UserInt>("user", user);
