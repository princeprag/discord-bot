import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { SlashInt } from "../../interfaces/slash/SlashInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const ping: SlashInt = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the uptime of the bot."),
  async run(Becca, interaction) {
    try {
      const { createdTimestamp } = interaction;

      const delay = Date.now() - createdTimestamp;
      const isSlow = delay > 100;

      const pingEmbed = new MessageEmbed();
      pingEmbed.setTitle("Pong!");
      pingEmbed.setFooter(
        isSlow
          ? "Kind of in the middle of something here..."
          : "I was bored anyway."
      );
      pingEmbed.setDescription(`Response time: ${delay}ms`);
      pingEmbed.setColor(isSlow ? Becca.colours.error : Becca.colours.success);

      await interaction.reply({ embeds: [pingEmbed] });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "ping command",
        err,
        interaction.guild?.name
      );
      await interaction.reply({
        embeds: [errorEmbedGenerator(Becca, "ping", errorId)],
        ephemeral: true,
      });
    }
  },
};
