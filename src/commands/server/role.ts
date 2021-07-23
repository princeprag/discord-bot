import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const role: CommandInt = {
  name: "role",
  description: "Adds or removes an assignable role from the user",
  parameters: [
    "`role`: the name or ID of the role to assign. Leave blank to get a list of roles",
  ],
  category: "server",
  run: async (Becca, message, config) => {
    try {
      const { member, guild, content } = message;

      if (!guild || !member) {
        return { success: false, content: "I cannot locate your guild record" };
      }

      const [, ...rawRole] = content.split(" ");

      const targetRole = rawRole?.join(" ") || "";

      if (!targetRole) {
        const roleList = new MessageEmbed();
        roleList.setColor(Becca.colours.default);
        roleList.setTitle("Available Charms");
        roleList.setDescription(
          "These are the charms I can enchant you with: \n" +
            config.self_roles.map((el) => `<@&${el}>`).join("\n")
        );
        return { success: true, content: roleList };
      }

      const guildRole = guild.roles.cache.find(
        (role) => role.name === targetRole || role.id === targetRole
      );
      if (!guildRole) {
        return {
          success: false,
          content:
            "That is not a valid enchantment. You cannot make things up here.",
        };
      }

      if (!config.self_roles.includes(guildRole.id)) {
        return {
          success: false,
          content:
            "I cannot cast that enchantment. You'll need to speak to someone higher up for that.",
        };
      }

      if (member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
        return {
          success: true,
          content: `You are no longer enchanted with \`${guildRole.name}\``,
        };
      }

      await member.roles.add(guildRole);
      return {
        success: true,
        content: `I have cast the \`${guildRole.name}\` charm on you.`,
      };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "role command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "role", errorId),
      };
    }
  },
};
