import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const config: CommandInt = {
  name: "config",
  description:
    "Returns the bot configuration for this server. (The parameters are only for server administrators)",
  parameters: [
    "`<?action (set)>`: set a channel, role or the prefix to the bot server configuration",
    "`<?sub-action (channel/role/prefix)>`: use this with `{@prefix}config <action>`",
    "`<?mention>`: channel or role mention, use this with `{@prefix}config set channel` or `{@prefix}config set role`",
    "`<?prefix>`: the new prefix, use this with `{@prefix}config set prefix`",
  ],
  run: async (message) => {
    // Get the bot client, current channel, command arguments and current guild, mentions and member of the message.
    const { bot, channel, commandArguments, guild, mentions, member } = message;

    // Check if the guild and member are valid.
    if (!guild || !member) {
      return;
    }

    // Get `getTextChannelFromSettings`, the prefix and `setSetting` from the bot client.
    const { getTextChannelFromSettings, prefix, setSetting } = bot;

    // Get the next argument as the config type.
    const configType = commandArguments.shift();

    // Check if the config type is `set` (`config set channel` or `config set role`).
    if (configType === "set") {
      // Check if the author has the administrator permission.
      if (!member.hasPermission("ADMINISTRATOR")) {
        await message.reply("you must be a server administrator.");
        return;
      }

      // Get the next argument as the set type.
      const setType = commandArguments.shift();

      // Check if the set type is `channel`.
      if (setType === "channel") {
        // Get the next argument as the channel type.
        const channelType = commandArguments.shift();

        // Get the next argument as the channel mention.
        const channelMention = commandArguments.shift();

        // Get the first channel mentioned.
        const channelMentioned = mentions.channels.first();

        if (channelMention && channelMentioned) {
          // Check if the channel mention and channel mentioned are equals.
          if (channelMention !== channelMentioned.toString()) {
            await message.reply(`the channel ${channelMention} is not valid.`);
            return;
          }
        }

        // Check if the channel mentioned is valid.
        if (channelMentioned) {
          let channelConfigured = "";

          // Check if the channel type is `logs`.
          if (channelType === "logs") {
            await setSetting(guild.id, "logs_channel", channelMentioned.id);

            channelConfigured = "logs";
          }
          // Check if the channel type is `welcomes`.
          else if (channelType === "welcomes") {
            await setSetting(
              guild.id,
              "join_leave_channel",
              channelMentioned.id
            );

            channelConfigured = "welcomes";
          } else {
            await message.reply(
              `'${channelType}' is not a valid channel for \`${prefix}config set channel\`.`
            );

            return;
          }

          await message.reply(
            `now ${channelMentioned.toString()} is the ${channelConfigured} channel.`
          );
        } else if (channelType) {
          await message.reply("you must mention a channel.");
        } else {
          await message.reply(
            "you must specify a channel type (logs/welcomes)."
          );
        }

        return;
      }
      // Check if the set type is `prefix`.
      else if (setType === "prefix") {
        // Get the next argument as the new prefix.
        const newPrefix = commandArguments.shift();

        // Check if the new prefix does not exist.
        if (!newPrefix) {
          await message.reply("you must enter the new prefix.");
        } else {
          message.bot.prefix = newPrefix;
          await setSetting(guild.id, "prefix", newPrefix);
          await message.reply(`now '${newPrefix}' is the new commands prefix.`);
        }

        return;
      }

      await message.reply(
        `'${setType}' is not a valid configuration for \`${prefix}config set\`.`
      );

      return;
    } else if (configType) {
      await message.reply(`'${configType}' is not a valid configuration type.`);
      return;
    }

    // Create a new empty embed.
    const configEmbed = new MessageEmbed();

    // Add the title.
    configEmbed.setTitle("Here are my current settings.");

    // Get the logs channel from the database.
    const logsChannel = await getTextChannelFromSettings("logs_channel", guild);

    // Add the logs channel to an embed field.
    configEmbed.addField(
      "Logs channel",
      logsChannel
        ? `Moderation activity, such as kicks, bans, warnings, and deleted messages will go to the ${logsChannel.toString()} channel.`
        : `Please configure a logs channel using \`${prefix}config set channel logs #logs-channel)\`.`
    );

    // Get the welcomes channel from the database.
    const welcomesChannel = await getTextChannelFromSettings(
      "join_leave_channel",
      guild
    );

    // Add the welcomes channel to an embed field.
    configEmbed.addField(
      "Welcomes channel",
      welcomesChannel
        ? `Members will be welcomed (and member departures will be mentioned) in the ${welcomesChannel.toString()} channel.`
        : `Please configure a welcomes channel using \`${prefix}config set channel welcomes #welcomes-channel)\`.`
    );

    // Send the embed to the current channel.
    await channel.send(configEmbed);
  },
};

export default config;
