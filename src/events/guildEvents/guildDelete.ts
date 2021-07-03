import { Guild, MessageEmbed } from "discord.js";
import LevelModel from "../../database/models/LevelModel";
import ServerModel from "../../database/models/ServerModel";
import StarModel from "../../database/models/StarModel";
import WarningModel from "../../database/models/WarningModel";
import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Sends a notification to the debug hook when Becca leaves a server. Also cleans up
 * the stored data for that server.
 * @param Becca Becca's Client instance.
 * @param guild The guild object representing the server Becca was removed from.
 */
export const guildDelete = async (
  Becca: BeccaInt,
  guild: Guild
): Promise<void> => {
  const guildDeleteEmbed = new MessageEmbed();
  guildDeleteEmbed.setTitle(
    `${Becca.user?.username || "Becca Lyria"} has been enlisted in a new guild!`
  );
  guildDeleteEmbed.setDescription(
    "It would seem they have need of my services."
  );
  guildDeleteEmbed.addField("Guild Name", guild.name, true);
  guildDeleteEmbed.addField(
    "Guild Owner",
    guild.owner?.user.username || "No owner data available.",
    true
  );
  guildDeleteEmbed.addField("Guild ID", guild.id, true);
  guildDeleteEmbed.addField(
    "Guild Owner ID",
    guild.owner?.id || "No owner data available",
    true
  );
  guildDeleteEmbed.setColor(Becca.colours.warning);
  guildDeleteEmbed.setTimestamp();

  await Becca.debugHook.send(guildDeleteEmbed);

  /**
   * Clean up the server data.
   */
  await ServerModel.findOneAndDelete({ serverID: guild.id });
  await LevelModel.findOneAndDelete({ serverID: guild.id });
  await StarModel.findOneAndDelete({ serverID: guild.id });
  await WarningModel.findOneAndDelete({ serverID: guild.id });
};
