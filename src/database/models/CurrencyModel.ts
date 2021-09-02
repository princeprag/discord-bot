import { Document, model, Schema } from "mongoose";

export interface CurrencyInt extends Document {
  userId: string;
  currencyTotal: number;
  dailyClaimed: number;
  weeklyClaimed: number;
  monthlyClaimed: number;
  slotsPlayed: number;
}

export const Currency = new Schema({
  userId: String,
  currencyTotal: Number,
  dailyClaimed: Number,
  weeklyClaimed: Number,
  monthlyClaimed: Number,
  slotsPlayed: {
    type: Number,
    default: 0,
  },
});

export default model<CurrencyInt>("currency", Currency);
