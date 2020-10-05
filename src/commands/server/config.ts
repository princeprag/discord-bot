import CommandInt from "@Interfaces/CommandInt";
import SettingModel from "@Models/SettingModel";
import { MessageEmbed } from "discord.js";

const config: CommandInt = {
  name: "config",
  description:
    "Returns the bot configuration for this server. (The parameters are only for server administrators)",
  parameters: [
    "`<?action (set/add/remove)>`: set a channel, role or the prefix to the bot server configuration, or add or remove an user to heart listener.",
    "`<?sub-action (channel/role/prefix/hearts)>`: use this with `{@prefix}config <action>`",
    "`<?type (logs/welcomes/restricted/moderator)>`: type of the channel or role, use this whit `{@prefix}config set channel <type>` or `{@prefix}config set role <type>`",
    "`<?mention (role/channel)>`: channel or role mention, use this with `{@prefix}config set channel <type> <mention>` or `{@prefix}config set role <type> <mention>`",
    "`<?mention (user)>`: user mention, use this `{@prefix}config add hearts <mention>` or `{@prefix}config remove hearts <mention>`",
    "`<?prefix>`: the new prefix, use this with `{@prefix}config set prefix <prefix>`",
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

    // Check if the config type is `set`, `add` or `remove`.
    if (
      configType === "set" ||
      configType === "add" ||
      configType === "remove"
    ) {
      // Check if the author has the administrator permission.
      if (!member.hasPermission("ADMINISTRATOR")) {
        await message.reply("you must be a server administrator.");
        return;
      }

      // Get the next argument as the set type.
      const setType = commandArguments.shift();

      if (configType === "set") {
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
              await message.reply(
                `the channel ${channelMention} is not valid.`
              );

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
                `'${channelType}' is not a valid channel for \`${
                  prefix[guild.id]
                }config set channel\`.`
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
        // Check if the set type is 'role'.
        else if (setType === "role") {
          // Get the next argument as the role type.
          const roleType = commandArguments.shift();

          // Get the next argument as the role mention.
          const roleMention = commandArguments.shift();

          // Get the first role mentioned.
          const roleMentioned = mentions.roles.first();

          if (roleMention && roleMentioned) {
            // Check if the role mention and role mentioned are equals.
            if (roleMention !== roleMentioned.toString()) {
              await message.reply(`the role ${roleMention} is not valid.`);
              return;
            }
          }

          // Check if the role mentioned is valid.
          if (roleMentioned) {
            let roleConfigured = "";

            // Check if the role type is `restricted`.
            if (roleType === "restricted") {
              await setSetting(guild.id, "restricted_role", roleMentioned.id);

              roleConfigured = "restricted";
            }
            // Check if the role type is `moderator`.
            else if (roleType === "moderator") {
              await setSetting(guild.id, "moderator_role", roleMentioned.id);

              roleConfigured = "moderator";
            } else {
              await message.reply(
                `'${roleType}' is not a valid role for \`${
                  prefix[guild.id]
                }config set role\`.`
              );

              return;
            }

            await message.reply(
              `now ${roleMentioned.toString()} is the ${roleConfigured} role.`
            );
          } else if (roleType) {
            await message.reply("you must mention a role.");
          } else {
            await message.reply("you must specify a role type (restricted).");
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
            message.bot.prefix[guild.id] = newPrefix;
            await setSetting(guild.id, "prefix", newPrefix);

            await message.reply(
              `now '${newPrefix}' is the new commands prefix.`
            );
          }

          return;
        }
      } else {
        // Check if the set type is `hearts`.
        if (setType === "hearts") {
          // Get the next argument as the user mention.
          let userMention = commandArguments.shift();

          // Get the first user mentioned.
          const userMentioned = mentions.users.first();

          if (userMention && userMentioned) {
            // Remove the `<@!` and `>` from the mention to get the id.
            userMention = userMention.replace(/[<@!>]/gi, "");

            // Check if the user mention and user mentioned are equals.
            if (userMention !== userMentioned.id) {
              await message.reply(`the user ${userMention} is not valid.`);
              return;
            }
          }

          if (userMentioned) {
            const currentUsers = await SettingModel.findOne({
              server_id: guild.id,
              key: "loves",
            });

            if (currentUsers) {
              const users = currentUsers.value.split(",");
              let messageReply: string;

              if (configType === "add") {
                if (users.includes(userMentioned.id)) {
                  await message.reply(
                    `${userMentioned.username} is in the hearts listener.`
                  );

                  return;
                }

                users.push(userMentioned.id);
                currentUsers.value += users.join(",");
                messageReply =
                  "successfully, added the user to hearts listener.";
              } else {
                const userIndex = users.findIndex(
                  (id) => id === userMentioned.id
                );

                if (userIndex < 0) {
                  await message.reply(
                    `${userMentioned.username} is not in the hearts listener.`
                  );

                  return;
                }

                users.splice(userIndex, 1);
                currentUsers.value = users.join(",");
                messageReply =
                  "successfully, removed the user from hearts listener.";
              }

              await currentUsers.save();
              await message.reply(messageReply);
              return;
            } else if (configType === "add") {
              await SettingModel.create({
                server_id: guild.id,
                key: "loves",
                value: userMentioned.id,
              });

              await message.reply(
                "successfully, added the user to hearts listener."
              );

              return;
            } else {
              await message.reply(
                `${userMentioned.username} is not in the hearts listener.`
              );

              return;
            }
          }
        }
      }

      await message.reply(
        `'${setType}' is not a valid configuration for \`${
          prefix[guild.id]
        }config ${configType}\`.`
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
        : `Please configure a logs channel using \`${
            prefix[guild.id]
          }config set channel logs #logs-channel)\`.`
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
        : `Please configure a welcomes channel using \`${
            prefix[guild.id]
          }config set channel welcomes #welcomes-channel)\`.`
    );

    // Send the embed to the current channel.
    await channel.send(configEmbed);
  },
};

export default config;
