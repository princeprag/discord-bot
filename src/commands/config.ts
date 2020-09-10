import { CommandInt } from "../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import configData from "../../config.json";

export const config: CommandInt = {
  prefix: "config",
  description: "Returns information on the config variables",
  parameters: "*none*",
  command: (message) => {
    const configEmbed = new MessageEmbed()
      .setTitle("Here are my current settings.")
      .setDescription(
        "These settings are configured within the code. At the moment, they cannot be changed on a per-server basis. Please ensure you have the correct channels/server structure to maximise my capabilities."
      )
      .addFields(
        {
          name: "Log Channel",
          value: `Moderation activity, such as kicks, bans, warnings, and deleted messages will go to the \`${configData.log_channel}\` channel.`,
        },
        {
          name: "Welcome Channel",
          value: `Members will be welcomed (and member departures will be mentioned) in the \`${configData.join_leave_channel}\` channel.`,
        },
        {
          name: "Restriction Process",
          value: `My restriction process is a bit tricky. I will assign the \`${configData.silence_role}\` role to the target user. I will create a channel for them in the \`${configData.silence_category}\` category. I will allow access to only that user, the moderators with the \`${configData.mod_role}\` role, and myself through the \`${configData.bot_role}\`. If any of this is missing, I will not be able to perform the command.`,
        }
      );
    message.channel.send(configEmbed);
  },
};
