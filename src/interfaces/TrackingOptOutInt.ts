import { Document, Schema, model } from "mongoose";

export interface TrackingOptOutInt extends Document {
  userId: string;
  optOutDate: string;
}

export const trackingOptOutSchema = new Schema({
  userId: String,
  optOutDate: String,
});

export const trackingOptOut = model<TrackingOptOutInt>("trackingOptOut", trackingOptOutSchema);
