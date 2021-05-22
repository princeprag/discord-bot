import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed, TextChannel } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const closeChannel: CommandInt = {
  name: "close",
  description:
    "Closes the channel - only available for automatically generated appeal channels. Only available to moderators.",
  category: "moderation",
  run: async (message) => {
    try {
      const { author, channel, Becca, guild, member } = message;

      const { user } = Becca;

      // Check if the member has the manage channels permission.
      if (
        !guild ||
        !user ||
        !member ||
        !member.hasPermission("MANAGE_CHANNELS")
      ) {
        await message.channel.send(
          "You are not high enough level to use this skill."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the current channel as text channel.
      const channelToDelete = channel as TextChannel;

      // Check if the channel name does not includes `suspended`.
      if (!channelToDelete.name.includes("suspended")) {
        await message.channel.send("This room is not mine to close.");
        await message.react(message.Becca.no);
        return;
      }

      // Check if the current channel is deletable.
      if (channelToDelete.deletable) {
        // Delete the current channel.
        await channelToDelete.delete();
      }

      // Send a message embed to the logs channel.
      await Becca.sendMessageToLogsChannel(
        guild,
        new MessageEmbed()
          .setTitle("Channel deleted")
          .setDescription(
            `${author.toString()} has closed and deleted the '${
              channelToDelete.name
            }' channel.`
          )
          .setFooter(`The channel ID was ${channelToDelete.id}`)
          .setTimestamp()
      );
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "close command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default closeChannel;
