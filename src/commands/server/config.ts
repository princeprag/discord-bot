import CommandInt from "@Interfaces/CommandInt";
import SettingModel from "@Models/SettingModel";
import { MessageEmbed } from "discord.js";

const config: CommandInt = {
  name: "config",
  description:
    "Returns the bot configuration for this server. (The parameters are only for server administrators)",
  parameters: [
    "`<?action (set/add/remove/toggle)>`: set a channel, role or the prefix to the bot server configuration, or add or remove an user to heart listener.",
    "`<?sub-action (channel/role/prefix/hearts/thanks/levels)>`: use this with `{@prefix}config <action>`",
    "`<?type (logs/welcomes/restricted/moderator/welcome-message)>`: type of the channel or role, use this whit `{@prefix}config set channel <type>` or `{@prefix}config set role <type>`",
    "`<?mention (role/channel)>`: channel or role mention, use this with `{@prefix}config set channel <type> <mention>` or `{@prefix}config set role <type> <mention>`",
    "`<?mention (user)>`: user mention, use this `{@prefix}config add hearts <mention>` or `{@prefix}config remove hearts <mention>`",
    "`<?prefix>`: the new prefix, use this with `{@prefix}config set prefix <prefix>`",
  ],
  run: async (message) => {
    try {
      // Get the bot client, current channel, command arguments and current guild, mentions and member of the message.
      const {
        bot,
        channel,
        commandArguments,
        guild,
        mentions,
        member,
      } = message;

      // Check if the guild and member are valid.
      if (!guild || !member) {
        return;
      }

      // Get `getTextChannelFromSettings`, the prefix and `setSetting` from the bot client.
      const {
        getTextChannelFromSettings,
        getToggleFromSettings,
        prefix,
        setSetting,
        setToggle,
        getRoleFromSettings,
      } = bot;

      // Get the next argument as the config type.
      const configType = commandArguments.shift();

      // Check if the config type is `set`, `add` or `remove`.
      if (
        configType === "set" ||
        configType === "add" ||
        configType === "remove" ||
        configType === "toggle"
      ) {
        // Check if the author has the administrator permission.
        //NOTE: nhcarrigan hard-coded for development purposes.
        if (
          !member.hasPermission("MANAGE_GUILD") &&
          member.id !== process.env.OWNER_ID
        ) {
          await message.reply(
            "I am so sorry, but I can only do this for moderators with permission to manage server."
          );
          return;
        }

        // Get the next argument as the set type.
        const setType = commandArguments.shift();

        if (configType === "toggle") {
          if (setType === "thanks" || setType === "levels") {
            const toggleSetting = await getToggleFromSettings(setType, guild);
            await setToggle(guild.id, setType, !toggleSetting);
            await message.reply(
              `I have turned the ${setType} feature ${
                !toggleSetting ? "on" : "off"
              }`
            );
            return;
          }
          await message.reply(
            `I am so sorry, but ${setType} is not a valid option to toggle.`
          );
          return;
        } else if (configType === "set") {
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
                  `I am so sorry, but ${channelMention} is not a valid channel.`
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
                  `'I am so sorry, but ${channelType}' is not a valid channel type for \`${
                    prefix[guild.id]
                  }config set channel\`.`
                );

                return;
              }

              await message.reply(
                `Okay! I have set ${channelMentioned.toString()} as the ${channelConfigured} channel.`
              );
            } else if (channelType) {
              await message.reply(
                "Would you please try the command again, and provide the channel you want me to use?"
              );
            } else {
              await message.reply(
                "Would you please try the command again, and tell me if this is the `logs` or `welcomes` channel?"
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
                await message.reply(
                  `I am so sorry, but ${roleMention} is not a valid role.`
                );
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
                  `I am so sorry, but '${roleType}' is not a valid role type for \`${
                    prefix[guild.id]
                  }config set role\`.`
                );

                return;
              }

              await message.reply(
                `Okay! I have set ${roleMentioned.toString()} as the ${roleConfigured} role.`
              );
            } else if (roleType) {
              await message.reply(
                "Would you please try the command again, and provide the role you want me to use?"
              );
            } else {
              await message.reply(
                "Would you please try the command again, and tell me if this is the `restricted` or `moderator` role?"
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
              await message.reply(
                "Would you please try the command again, and provide the new prefix you would like me to watch for?"
              );
            } else {
              message.bot.prefix[guild.id] = newPrefix;
              await setSetting(guild.id, "prefix", newPrefix);

              await message.reply(
                `Okay! I have set '${newPrefix}' as the new commands prefix.`
              );
            }

            return;
          } else if (setType === "welcome-message") {
            const welcomeMessage = commandArguments.join(" ");
            if (welcomeMessage.length > 1000) {
              await message.reply(
                "Sorry, but that message is too long. Would you please try the command again with a shorter message?"
              );
              return;
            }
            await setSetting(guild.id, "welcome_message", welcomeMessage);
            await message.reply(
              "Okay, I have set your custom welcome message."
            );
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
                await message.reply(
                  `I am so sorry, but ${userMention} is not a valid user.`
                );
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
                      `Okay! I have added ${userMentioned.username} to the hearts listener.`
                    );

                    return;
                  }

                  users.push(userMentioned.id);
                  currentUsers.value += users.join(",");
                  messageReply = "I added the user to hearts listener.";
                } else {
                  const userIndex = users.findIndex(
                    (id) => id === userMentioned.id
                  );

                  if (userIndex < 0) {
                    await message.reply(
                      `I am sorry, but ${userMentioned.username} is not in the hearts listener.`
                    );

                    return;
                  }

                  users.splice(userIndex, 1);
                  currentUsers.value = users.join(",");
                  messageReply =
                    "Okay! I removed the user from hearts listener.";
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
                  "Okay! I added the user to hearts listener."
                );

                return;
              } else {
                await message.reply(
                  `I am sorry, but ${userMentioned.username} is not in the hearts listener.`
                );

                return;
              }
            }
            await message.reply(
              `I am so sorry, but ${userMention} is not a valid user.`
            );
            return;
          }
        }

        await message.reply(
          `I am so sorry, but '${setType}' is not a valid configuration for \`${
            prefix[guild.id]
          }config ${configType}\`.`
        );

        return;
      } else if (configType) {
        await message.reply(
          `I am so sorry, but '${configType}' is not a valid configuration type.`
        );
        return;
      }

      // Create a new empty embed.
      const configEmbed = new MessageEmbed();

      // Add the title.
      configEmbed.setTitle("Here is my record for your server.");

      // Get the logs channel from the database.
      const logsChannel = await getTextChannelFromSettings(
        "logs_channel",
        guild
      );

      // Add the logs channel to an embed field.
      configEmbed.addField(
        "Log channel",
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
        "Welcome Channel",
        welcomesChannel
          ? `Members will be welcomed (and member departures will be mentioned) in the ${welcomesChannel.toString()} channel.`
          : `Please configure a welcomes channel using \`${
              prefix[guild.id]
            }config set channel welcomes #welcomes-channel)\`.`
      );

      // Get the restricted role from the database
      const restrictRole = await getRoleFromSettings("restricted_role", guild);

      // Add the restricted role to an embed field.
      configEmbed.addField(
        "Restricted Role",
        restrictRole
          ? `The restrict and unrestrict role for the server is ${restrictRole.toString()}`
          : `Please configure a restrict role using \`${
              prefix[guild.id]
            }config set role restricted @role\`.`
      );

      // Get the moderator role from the database
      const modRole = await getRoleFromSettings("moderator_role", guild);

      // Add the moderator role to an embed field.
      configEmbed.addField(
        "Moderator Role",
        modRole
          ? `The moderator role for the restrict command is ${modRole.toString()}`
          : `Please configure a moderator role using \`${
              prefix[guild.id]
            }config set role moderator @role\`.`
      );

      // Get the thanks setting from the database
      const shouldThank = await getToggleFromSettings("thanks", guild);

      // Add the thanks setting to an embed field.
      configEmbed.addField(
        "Thanks",
        `I will${
          shouldThank ? "" : " NOT"
        } congratulate users when another user thanks them.`
      );

      //get the levels setting from the database
      const shouldLevel = await getToggleFromSettings("levels", guild);

      // Add the levels setting to an embed field.
      configEmbed.addField(
        "Levels",
        `I will${
          shouldLevel ? "" : " NOT"
        } give users experience points for being active.`
      );

      //get the custom welcome message from the database:
      const activeWelcomeMessage = await SettingModel.findOne({
        server_id: guild.id,
        key: "welcome_message",
      });

      // Add welcome message status to embed
      configEmbed.addField(
        "Welcome Message",
        activeWelcomeMessage
          ? activeWelcomeMessage.value
          : "Hello `{@username}`! Welcome to {@servername}! My name is Becca, and I am here to help!"
      );

      // Send the embed to the current channel.
      await channel.send(configEmbed);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the config command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default config;
