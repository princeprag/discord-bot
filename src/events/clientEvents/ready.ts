import { MessageEmbed } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Sends a notification to the debug hook when Becca has connected to
 * Discord and is ready to recieve events.
 * @param Becca Becca's Client instance.
 */
export const ready = async (Becca: BeccaInt): Promise<void> => {
  const readyEmbed = new MessageEmbed();
  readyEmbed.setTitle("Becca is online");
  readyEmbed.setDescription(
    `${Becca.user?.username || "Becca Lyria"} has come online.`
  );
  readyEmbed.setTimestamp();
  readyEmbed.setColor(Becca.colours.success);
  readyEmbed.setFooter(`Version ${Becca.configs.version}`);

  await Becca.debugHook.send(readyEmbed);
};
