import { MessageEmbed } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Handles the shardReady event - sends a message to the debug hook when
 * a shard comes online.
 * @param Becca Becca's Client instance.
 * @param shard The number of the shard that has come online.
 */
export const shardReady = async (
  Becca: BeccaInt,
  shard: number
): Promise<void> => {
  const shardEmbed = new MessageEmbed();
  shardEmbed.setTitle("Shard Online!");
  shardEmbed.setDescription("Becca has brought a new shard online!");
  shardEmbed.addField("Shard", shard.toString());
  shardEmbed.setTimestamp();
  shardEmbed.setColor(Becca.colours.success);

  await Becca.debugHook.send({ embeds: [shardEmbed] });
};
