import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed, TextChannel } from "discord.js";

const closeChannel: CommandInt = {
  names: ["close", "close-channel"],
  description:
    "Closes the channel - only available for automatically generated appeal channels. Only available to moderators.",
  run: async (message) => {
    const { author, channel, bot, guild, member } = message;

    const { user } = bot;

    // Check if the member has the manage channels permission.
    if (
      !guild ||
      !user ||
      !member ||
      !member.hasPermission("MANAGE_CHANNELS")
    ) {
      await message.reply(
        "Sorry, but this command is restricted to moderators."
      );

      return;
    }

    // Get the current channel as text channel.
    const channelToDelete = channel as TextChannel;

    // Check if the channel name does not includes `suspended`.
    if (!channelToDelete.name.includes("suspended")) {
      await message.reply(
        "Sorry, but I am only allowed to close the `suspended-user` channels."
      );

      return;
    }

    // Check if the current channel is deletable.
    if (channelToDelete.deletable) {
      // Delete the current channel.
      await channelToDelete.delete();
    }

    // Send a message embed to the logs channel.
    await bot.sendMessageToLogsChannel(
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
  },
};

export default closeChannel;
