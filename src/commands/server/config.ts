import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const config: CommandInt = {
  name: "config",
  description:
    "Returns the bot configuration for this server. (The parameters are only for server administrators)",
  parameters: [
    "`<setting>` - The setting you would like to set. See the docs for available options.",
    "`<value>` - The value of that setting. See the docs for available options.",
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
      const { prefix, setSetting, getSettings } = bot;

      // Get the next argument as the config type.
      const configType = commandArguments.shift();

      if (!configType) {
        // Create a new empty embed.
        const configEmbed = new MessageEmbed();

        // Add the title.
        configEmbed.setTitle("Here is my record for your server.");

        const serverSettings = await getSettings(guild.id, guild.name);

        // Add the logs channel to an embed field.
        configEmbed.addField(
          "Log channel",
          serverSettings.log_channel
            ? `Moderation activity, such as kicks, bans, warnings, and deleted messages will go to the ${serverSettings.log_channel} channel.`
            : `Please configure a logs channel using \`${
                prefix[guild.id]
              }config set log_channel #channel)\`.`
        );

        // Add the welcomes channel to an embed field.
        configEmbed.addField(
          "Welcome Channel",
          serverSettings.welcome_channel
            ? `Members will be welcomed (and member departures will be mentioned) in the ${serverSettings.welcome_channel} channel.`
            : `Please configure a welcomes channel using \`${
                prefix[guild.id]
              }config set welcome_channel #channel)\`.`
        );

        // Add the restricted role to an embed field.
        configEmbed.addField(
          "Restricted Role",
          serverSettings.restricted_role
            ? `The restrict and unrestrict role for the server is ${serverSettings.restricted_role}`
            : `Please configure a restrict role using \`${
                prefix[guild.id]
              }config set restricted_role @role\`.`
        );

        // Add the moderator role to an embed field.
        configEmbed.addField(
          "Moderator Role",
          serverSettings.moderator_role
            ? `The moderator role for the restrict command is ${serverSettings.moderator_role}`
            : `Please configure a moderator role using \`${
                prefix[guild.id]
              }config set role moderator @role\`.`
        );

        // Add the thanks setting to an embed field.
        configEmbed.addField(
          "Thanks",
          `I will${
            serverSettings.thanks === "on" ? "" : " NOT"
          } congratulate users when another user thanks them.`
        );

        // Add the levels setting to an embed field.
        configEmbed.addField(
          "Levels",
          `I will${
            serverSettings.levels === "on" ? "" : " NOT"
          } give users experience points for being active.`
        );

        // Add welcome message status to embed
        configEmbed.addField(
          "Welcome Message",
          serverSettings.custom_welcome
            ? serverSettings.custom_welcome
            : "Hello `{@username}`! Welcome to {@servername}! My name is Becca, and I am here to help!"
        );

        // Send the embed to the current channel.
        await channel.send(configEmbed);
        return;
      }
      if (configType !== "set") {
        await message.reply(
          `I am so sorry, but ${configType} is not a valid action for me to take.`
        );
        return;
      }
      const key = commandArguments.shift();

      if (!key) {
        await message.reply(
          "Would you please try the command again, and provide the setting you would like me to change?"
        );
        return;
      }
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
        ].includes(key)
      ) {
        await message.reply(
          `I am so sorry, but ${key} is not a valid action for me to take.`
        );
        return;
      }
      const value = commandArguments.join(" ");
      if (!value) {
        await message.reply(
          "Would you please try the command again, and tell me the value you would like me to set?"
        );
        return;
      }
      if (key === "prefix") {
        prefix[guild.id] = value;
      }
      await setSetting(guild.id, guild.name, key, value);
      await channel.send(
        key === "hearts"
          ? `Okay, I will give hearts to ${value}!`
          : `Okay, I have set ${key} to ${value}!`
      );
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
