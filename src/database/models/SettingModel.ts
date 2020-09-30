import { Schema, Document, model } from "mongoose";

export interface ISettingModel extends Document {
  server_id: string;
  key: string;
  value: string;
}

const setting = new Schema({
  server_id: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  value: String,
});

export default model<ISettingModel>("setting", setting);
