import {
  Client,
  Guild,
  GuildChannel,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import ClientInt from "@Interfaces/ClientInt";
import SettingModel, { SettingModelInt } from "@Models/SettingModel";
import { sleep } from "./extendsMessageToMessageInt";

/**
 * See `./src/interfaces/ClientInt.ts` for more information.
 *
 * @async
 * @function
 * @param { string } server_id
 * @param { string } key
 * @param { string } value
 * @returns { Promise<SettingModelInt> }
 */
async function setSetting(
  server_id: string,
  key: string,
  value: string
): Promise<SettingModelInt> {
  const setting = await SettingModel.findOne({
    server_id,
    key,
  });

  if (!setting) {
    return await SettingModel.create({
      server_id,
      key,
      value,
    });
  }

  setting.value = value;

  await setting.save();

  return setting;
}

/**
 * See `./src/interfaces/ClientInt.ts` for more information.
 *
 * @async
 * @function
 * @param { string } key
 * @param { Guild } guild
 * @returns { Promise<TextChannel | null> }
 */
async function getTextChannelFromSettings(
  key: string,
  guild: Guild
): Promise<TextChannel | null> {
  // Get the channel id of the server from the database.
  const channelSetting = await SettingModel.findOne({
    server_id: guild.id,
    key,
  });

  // Check if the channel exists in the database.
  if (channelSetting) {
    // Get the channel from the server channels.
    const channel = guild.channels.cache.get(channelSetting.value);

    // Check if the channel exists and is a text channel.
    if (
      channel &&
      ((o: GuildChannel): o is TextChannel => o.type === "text")(channel)
    ) {
      return channel;
    }
  }

  return null;
}

/**
 * See `./src/interfaces/ClientInt.ts` for more information.
 *
 * @async
 * @function
 * @param { ClientInt } this
 * @param { Guild } guild
 * @param { string | MessageEmbed } message
 * @returns { Promise<void> }
 */
async function sendMessageToLogsChannel(
  this: ClientInt,
  guild: Guild,
  message: string | MessageEmbed
): Promise<void> {
  // Get the logs channel from the database.
  const logsChannel = await this.getTextChannelFromSettings(
    "logs_channel",
    guild
  );

  // Check if the channel exists.
  if (!logsChannel) {
    return;
  }

  // Start typing.
  logsChannel.startTyping();

  // Sleep 3 seconds.
  await sleep(3000);

  // Stop typing.
  logsChannel.stopTyping();

  // Send the message to the logs channel.
  await logsChannel.send(message);
}

/**
 * Add the ClientInt methods to a Discord Client interface.
 *
 * @function
 * @param { Client } client
 * @returns { ClientInt }
 */
function extendsClientToClientInt(client: Client): ClientInt {
  const new_client = client as ClientInt;

  new_client.setSetting = setSetting;
  new_client.getTextChannelFromSettings = getTextChannelFromSettings;
  new_client.sendMessageToLogsChannel = sendMessageToLogsChannel;

  return new_client;
}

export default extendsClientToClientInt;
