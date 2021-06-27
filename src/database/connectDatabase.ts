import { connect } from "mongoose";
import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const connectDatabase = async (Becca: BeccaInt): Promise<boolean> => {
  try {
    await connect(Becca.configs.dbToken, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    Becca.debugHook.send("Becca has found her record room.");

    return true;
  } catch (err) {
    beccaErrorHandler(Becca, "database connection", err);
    return false;
  }
};
