import { Document, Schema, model, Model } from "mongoose";

export interface TrackingOptOutInt extends Document {
  user_id: string;
}

export const TrackingOptOutSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
});

export const TrackingOptOut: Model<TrackingOptOutInt> = model<
  TrackingOptOutInt
>("trackingOptOut", TrackingOptOutSchema);
