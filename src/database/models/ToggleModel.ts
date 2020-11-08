import { Schema, Document, model } from "mongoose";

export interface ToggleModelInt extends Document {
  server_id: string;
  key: string;
  value: boolean;
}

const toggle = new Schema({
  server_id: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  value: Boolean,
});

export default model<ToggleModelInt>("toggle", toggle);
