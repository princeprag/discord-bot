import { CommandInteraction } from "discord.js";
import CurrencyModel from "../database/models/CurrencyModel";
import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const currencyListener = {
  name: "currency",
  description: "Awards currency on command usage.",
  run: async (
    Becca: BeccaInt,
    interaction: CommandInteraction
  ): Promise<void> => {
    try {
      if (interaction.commandName === "nhcarrigan") {
        return;
      }
      const { user } = interaction;
      const target = user.id;

      const data =
        (await CurrencyModel.findOne({ discordId: target })) ||
        (await CurrencyModel.create({
          userId: interaction.user.id,
          currencyTotal: 0,
          dailyClaimed: 0,
          weeklyClaimed: 0,
          monthlyClaimed: 0,
        }));

      const earned = Math.floor(Math.random() * 5);

      data.currencyTotal += earned;
      await data.save();
    } catch (err) {
      beccaErrorHandler(Becca, "thanks listener", err, interaction.guild?.name);
    }
  },
};
