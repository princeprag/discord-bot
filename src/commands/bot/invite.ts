import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const invite: CommandInt = {
  name: "invite",
  description: "Provides a link to invite Becca to your guild.",
  parameters: [],
  category: "bot",
  run: async (Becca, message) => {
    try {
      const inviteEmbed = new MessageEmbed();
      inviteEmbed.setTitle("Do you require my assistance?");
      inviteEmbed.setDescription(
        "I suppose I could provide my services to your guild. Click this [invite link](http://invite.beccalyria.com) and I will come serve you."
      );
      inviteEmbed.setColor(Becca.colours.default);
      inviteEmbed.setFooter("I look forward to working with you.");
      inviteEmbed.setTimestamp();
      return { success: true, content: inviteEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "invite command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "invite", errorId),
      };
    }
  },
};
