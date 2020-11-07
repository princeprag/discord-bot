import { Document, model, Schema } from "mongoose";

export interface ProfileModelInt extends Document {
  userId: string;
  username: string;
  profiles: [
    {
      website: string;
      url: string;
    }
  ];
}

export const ProfileSchema = new Schema({
  userId: String,
  username: String,
  profiles: [Object],
});

export default model<ProfileModelInt>("profile", ProfileSchema);
