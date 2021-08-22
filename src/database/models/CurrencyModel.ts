import { Document, model, Schema } from "mongoose";

export interface CurrencyInt extends Document {
  userId: string;
  currencyTotal: number;
  dailyClaimed: number;
  weeklyClaimed: number;
  monthlyClaimed: number;
}

export const Currency = new Schema({
  userId: String,
  currencyTotal: Number,
  dailyClaimed: Number,
  weeklyClaimed: Number,
  monthlyClaimed: Number,
});

export default model<CurrencyInt>("currency", Currency);
