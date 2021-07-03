import { MessageEmbed } from "discord.js";
import { connect } from "mongoose";
import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const connectDatabase = async (Becca: BeccaInt): Promise<boolean> => {
  try {
    await connect(Becca.configs.dbToken, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const databaseEmbed = new MessageEmbed();
    databaseEmbed.setTitle("Database connected!");
    databaseEmbed.setDescription(
      `${Becca.user?.username || "Becca Lyria"} has found her record room.`
    );
    databaseEmbed.setTimestamp();
    databaseEmbed.setColor(Becca.colours.success);
    await Becca.debugHook.send(databaseEmbed);

    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "database connection", err);
    return false;
  }
};
