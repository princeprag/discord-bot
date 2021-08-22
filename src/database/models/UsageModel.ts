import { Document, model, Schema } from "mongoose";

export interface UsageInt extends Document {
  command: string;
  subcommand: string;
  uses: number;
}

export const Usage = new Schema({
  command: String,
  subcommand: String,
  uses: Number,
});

export default model<UsageInt>("usage", Usage);
