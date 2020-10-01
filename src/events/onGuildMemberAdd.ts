import ClientInt from "@Interfaces/ClientInt";
import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { sleep } from "@Utils/extendsMessageToMessageInt";
import SettingModel from "@Models/SettingModel";

/**
 * Send a message when a new user join to the server,
 * the message can be customed by every server owner.
 *
 * ## Elements inside a message
 * - `{@username}` - New user name.
 * - `{@servername}` - Current server name.
 *
 * @async
 * @function
 * @param { GuildMember | PartialGuildMember } member
 * @param { ClientInt } client
 * @returns { Promise<void> }
 */
async function onGuildMemberAdd(
  member: GuildMember | PartialGuildMember,
  client: ClientInt
): Promise<void> {
  // Get the user and the current guild.
  const { user, guild } = member;

  // Check if the new member is a valid user.
  if (!user) {
    return;
  }

  // Get the welcomes channel from the database.
  const welcomesChannel = await client.getTextChannelFromSettings(
    "join_leave_channel",
    guild
  );

  // Check if the welcomes channel exists.
  if (!welcomesChannel) {
    return;
  }

  // Set a default welcome message.
  let welcomeMessage =
    "Hello everyone! Let us give a warm welcome to `{@username}`!";

  // Get the custom welcome message from the database.
  const welcomeMessageSetting = await SettingModel.findOne({
    server_id: guild.id,
    key: "welcome_message",
  });

  // Check if the custom welcome message exists and replace the default for it.
  if (welcomeMessageSetting) {
    welcomeMessage = welcomeMessageSetting.value;
  }

  // Replace the custom elements.
  welcomeMessage
    .replace(/{@username}/gi, user.username)
    .replace(/{@servername}/gi, guild.name);

  await welcomesChannel.startTyping();
  await sleep(3000);

  welcomesChannel.stopTyping();

  // Send an embed message to the welcomes channel.
  await welcomesChannel.send(
    new MessageEmbed()
      .setColor("#AB47E6")
      .setTitle("A new user has joined! 🙃")
      .setDescription(welcomeMessage)
  );
}

export default onGuildMemberAdd;
