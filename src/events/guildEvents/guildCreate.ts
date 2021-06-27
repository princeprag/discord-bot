import { Guild, MessageEmbed } from "discord.js";
import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Generates an embed when Becca joins a guild and sends it to the debug hook.
 * @param Becca Becca's client instance
 * @param guild The guild object for the server Becca joined.
 */
export const guildCreate = async (
  Becca: BeccaInt,
  guild: Guild
): Promise<void> => {
  const guildCreateEmbed = new MessageEmbed();
  guildCreateEmbed.setTitle(
    `${Becca.user?.username || "Becca Lyria"} has been enlisted in a new guild!`
  );
  guildCreateEmbed.setDescription(
    "It would seem they have need of my services."
  );
  guildCreateEmbed.addField("Guild Name", guild.name, true);
  guildCreateEmbed.addField(
    "Guild Owner",
    guild.owner?.user.username || "No owner data available.",
    true
  );
  guildCreateEmbed.addField("Guild ID", guild.id, true);
  guildCreateEmbed.addField(
    "Guild Owner ID",
    guild.owner?.id || "No owner data available",
    true
  );
  guildCreateEmbed.setColor(Becca.colours.success);
  guildCreateEmbed.setTimestamp();

  await Becca.debugHook.send(guildCreateEmbed);
};
