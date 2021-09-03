import { Document, model, Schema } from "mongoose";

export interface ActivityInt extends Document {
  userId: string;
  buttons: number;
  commands: number;
  selects: number;
  contexts: number;
}

export const Activity = new Schema({
  userId: String,
  buttons: Number,
  commands: Number,
  selects: Number,
  contexts: Number,
});

export default model<ActivityInt>("activity", Activity);
