import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const config: CommandInt = {
  name: "config",
  description:
    "Returns Becca's configuration for this server. (The parameters are only for server administrators)",
  parameters: [
    "`<setting>` - The setting you would like to set. See the docs for available options.",
    "`<value>` - The value of that setting. See the docs for available options.",
  ],
  category: "server",
  run: async (message, config) => {
    try {
      // Get the client, current channel, command arguments and current guild, mentions and member of the message.
      const { Becca, channel, commandArguments, guild, member } = message;

      // Check if the guild and member are valid.
      if (!guild || !member) {
        await message.react(message.Becca.no);
        return;
      }

      if (
        !member.hasPermission("MANAGE_GUILD") &&
        member.id !== process.env.OWNER_ID
      ) {
        await message.reply(
          `I am so sorry, but I can only perform this for moderators with the permission to manage the server.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get `getTextChannelFromSettings`, the prefix and `setSetting` from the client.
      const { prefix, setSetting } = Becca;

      // Get the next argument as the config type.
      const configType = commandArguments.shift();

      if (!configType) {
        // Create a new empty embed.
        const configEmbed = new MessageEmbed();

        // Add the title.
        configEmbed.setTitle("Here is my record for your server.");

        // Add the logs channel to an embed field.
        configEmbed.addField(
          "Log channel",
          config.log_channel
            ? `Moderation activity, such as kicks, bans, warnings, and deleted messages will go to the <#${config.log_channel}> channel.`
            : `Please configure a logs channel using \`${
                prefix[guild.id]
              }config set log_channel #channel)\`.`
        );

        // Add the welcomes channel to an embed field.
        configEmbed.addField(
          "Welcome Channel",
          config.welcome_channel
            ? `Members will be welcomed (and member departures will be mentioned) in the <#${config.welcome_channel}> channel.`
            : `Please configure a welcomes channel using \`${
                prefix[guild.id]
              }config set welcome_channel #channel)\`.`
        );

        // Add the restricted role to an embed field.
        configEmbed.addField(
          "Restricted Role",
          config.restricted_role
            ? `The restrict and unrestrict role for the server is <@&${config.restricted_role}>`
            : `Please configure a restrict role using \`${
                prefix[guild.id]
              }config set restricted_role @role\`.`
        );

        // Add the moderator role to an embed field.
        configEmbed.addField(
          "Moderator Role",
          config.moderator_role
            ? `The moderator role for the restrict command is <@&${config.moderator_role}>`
            : `Please configure a moderator role using \`${
                prefix[guild.id]
              }config set moderator_role @role\`.`
        );

        // Add the thanks setting to an embed field.
        configEmbed.addField(
          "Thanks",
          `I will${
            config.thanks === "on" ? "" : " NOT"
          } congratulate users when another user thanks them.`
        );

        // Add the levels setting to an embed field.
        configEmbed.addField(
          "Levels",
          `I will${
            config.levels === "on" ? "" : " NOT"
          } give users experience points for being active.`
        );

        // Add welcome message status to embed
        configEmbed.addField(
          "Welcome Message",
          config.custom_welcome
            ? config.custom_welcome
            : "Hello `{@username}`! Welcome to `{@servername}`! My name is Becca, and I am here to help!"
        );

        // Send the embed to the current channel.
        await channel.send(configEmbed);

        // Create embed containing hearts users
        const heartsEmbed = new MessageEmbed()
          .setTitle("Hearts")
          .setFooter("These users will receive my love!")
          .setDescription(
            config.hearts.map((el) => `<@!${el}>`).join(" | ") || "No one :("
          );

        // send hearts embed
        await channel.send(heartsEmbed);

        // Create embed containing blocked users
        const blockedEmbed = new MessageEmbed()
          .setTitle("Blocked")
          .setFooter("These users will not receive my assistance.")
          .setDescription(
            config.blocked.map((el) => `<@!${el}>`).join(" | ") || "No one :)"
          );

        // send blocked embed
        await channel.send(blockedEmbed);

        // Create embed for assignable roles
        const rolesEmbed = new MessageEmbed()
          .setTitle("Self-Assignable Roles")
          .setFooter("These roles can be assigned with my `role` command.")
          .setDescription(
            config.self_roles.map((el) => `<@&${el}>`).join(" | ") ||
              "No roles :("
          );

        // send roles embed
        await channel.send(rolesEmbed);
        await message.react(message.Becca.yes);
        return;
      }

      // Check for valid type
      if (configType !== "set") {
        await message.reply(
          `I am so sorry, but ${configType} is not a valid action for me to take.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get setting to set
      const key = commandArguments.shift();

      // If no setting provided, end.
      if (!key) {
        await message.reply(
          "Would you please try the command again, and provide the setting you would like me to change?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // If invalid setting provided, end.
      if (
        ![
          "prefix",
          "thanks",
          "levels",
          "welcome_channel",
          "log_channel",
          "restricted_role",
          "moderator_role",
          "custom_welcome",
          "hearts",
          "blocked",
          "self_roles",
        ].includes(key)
      ) {
        await message.reply(
          `I am so sorry, but ${key} is not a valid action for me to take.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get value for setting.
      const value = commandArguments.join(" ");

      // If no value provided, end.
      if (!value) {
        await message.reply(
          "Would you please try the command again, and tell me the value you would like me to set?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // If setting channel, check for valid channel.
      if (key === "welcome_channel" || key === "log_channel") {
        const success = guild.channels.cache.find(
          (chan) => chan.id === value.replace(/\D/g, "")
        );
        if (!success) {
          await message.reply(
            `I am so sorry, but ${value} does not appear to be a valid channel.`
          );
          await message.react(message.Becca.no);
          return;
        }
      }

      // If setting role, check for valid role.
      if (
        key === "restricted_role" ||
        key === "moderator_role" ||
        key === "self_roles"
      ) {
        const success = guild.roles.cache.find(
          (role) => role.id === value.replace(/\D/g, "")
        );
        if (!success) {
          await message.reply(
            `I am so sorry, but ${value} does not appear to be a valid role.`
          );
          await message.react(message.Becca.no);
          return;
        }
      }

      // If setting hearts, check for valid user.
      if (key === "hearts" || key === "blocked") {
        const mem = await guild.members.fetch(value.replace(/\D/g, ""));
        if (!mem) {
          await message.reply(
            `I am so sorry, but ${value} does not appear to be a valid user.`
          );
          await message.react(message.Becca.no);
          return;
        }
        if (value.replace(/\D/g, "") === process.env.OWNER_ID) {
          await message.reply(
            key === "blocked"
              ? "Wait a moment! I will not refuse to help my beloved."
              : "My love for my darling can never be stopped."
          );
          await message.react(message.Becca.no);
          return;
        }
      }

      // If setting toggle, check for off/on.
      if (key === "thanks" || key === "levels") {
        if (value !== "on" && value !== "off") {
          await message.reply(
            `I am so sorry, but ${value} is not a valid option for ${key}. Please try again and tell me if you want ${key} to be turned \`on\` or \`off\`.`
          );
          await message.react(message.Becca.no);
          return;
        }
      }

      // Set client prefix.
      if (key === "prefix") {
        prefix[guild.id] = value.toLowerCase();
      }

      // Save settings.
      const newSettings = await setSetting(guild.id, guild.name, key, value);

      // Set confirmation response
      let confirmation = `Okay, I have set ${key} to ${value}`;

      // Handle hearts
      if (key === "hearts") {
        if (!newSettings.hearts.includes(value.replace(/\D/g, ""))) {
          confirmation = `Okay, I will stop giving hearts to ${value}!`;
        } else {
          confirmation = `Okay, I will give hearts to ${value}!`;
        }
      }

      // Handle blocked
      if (key === "blocked") {
        if (!newSettings.blocked.includes(value.replace(/\D/g, ""))) {
          confirmation = `Okay, I will resume helping ${value}!`;
        } else {
          confirmation = `Okay, I will stop helping ${value}!`;
        }
      }

      // Handle self roles
      if (key === "self_roles") {
        if (!newSettings.self_roles.includes(value.replace(/\D/g, ""))) {
          confirmation = `Okay, ${value} is no longer self-assignable.`;
        } else {
          confirmation = `Okay, ${value} is now self-assignable.`;
        }
      }

      // Send confirmation.
      await channel.send(confirmation);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the config command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the config command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default config;
