import { MessageEmbed } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Sends a message to the debug hook when Becca disconnects.
 * @param Becca Becca's Client instance
 */
export const disconnect = async (Becca: BeccaInt): Promise<void> => {
  const disconnectEmbed = new MessageEmbed();
  disconnectEmbed.setTitle("Becca has disconnected");
  disconnectEmbed.setDescription(
    `${
      Becca.user?.username || "Becca Lyria"
    } is no longer connected to Discord.`
  );
  disconnectEmbed.setTimestamp();
  disconnectEmbed.setColor(Becca.colours.error);
  await Becca.debugHook.send({ embeds: [disconnectEmbed] });
};
