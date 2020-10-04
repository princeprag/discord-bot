import { Document, Schema, model, Model } from "mongoose";

export interface TrackingOptOutInt extends Document {
  userId: string;
}

export const TrackingOptOutSchema = new Schema({
  userId: String,
});

export const TrackingOptOut: Model<TrackingOptOutInt> = model<
  TrackingOptOutInt
>("trackingOptOut", TrackingOptOutSchema);
