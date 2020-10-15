import ClientInt from "@Interfaces/ClientInt";
import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { sleep } from "@Utils/extendsMessageToMessageInt";

async function onGuildMemberRemove(
  member: GuildMember | PartialGuildMember,
  client: ClientInt
): Promise<void> {
  // Get the user and the current guild.
  const { user, guild, nickname } = member;

  // Check if the new member is a valid user.
  if (!user) {
    return;
  }

  // Get the goodbye channel from the database.
  const goodbyeChannel = await client.getTextChannelFromSettings(
    "join_leave_channel",
    guild
  );

  // Check if the goodbye channel exists.
  if (!goodbyeChannel) {
    return;
  }

  goodbyeChannel.startTyping();
  await sleep(3000);

  goodbyeChannel.stopTyping();

  // Send an embed message to the goodbye channel.
  await goodbyeChannel.send(
    new MessageEmbed()
      .setColor("#AB47E7")
      .setTitle("A user has left us!")
      .setDescription(
        `${nickname || user.username} has left us. You will be missed!`
      )
  );
}

export default onGuildMemberRemove;
