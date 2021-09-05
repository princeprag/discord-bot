import { MessageEmbed } from "discord.js";
import { connect } from "mongoose";

import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Instantiates the database connection.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @returns {boolean} True if the connection was successful.
 */
export const connectDatabase = async (Becca: BeccaInt): Promise<boolean> => {
  try {
    await connect(Becca.configs.dbToken);

    const databaseEmbed = new MessageEmbed();
    databaseEmbed.setTitle("Database connected!");
    databaseEmbed.setDescription(
      `${Becca.user?.username || "Becca Lyria"} has found her record room.`
    );
    databaseEmbed.setTimestamp();
    databaseEmbed.setColor(Becca.colours.success);
    await Becca.debugHook.send({ embeds: [databaseEmbed] });

    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "database connection", err);
    return false;
  }
};
