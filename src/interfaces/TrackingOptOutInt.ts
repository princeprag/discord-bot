import { Document, Schema, model } from "mongoose";

export interface TrackingOptOutInt extends Document {
  userId: string;
}

export const TrackingOptOutSchema = new Schema({
  userId: String,
});

export const TrackingOptOut = model<TrackingOptOutInt>(
  "trackingOptOut",
  TrackingOptOutSchema
);
