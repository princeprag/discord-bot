import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const role: CommandInt = {
  name: "role",
  description: "Adds or removes an assignable role from the user.",
  parameters: [
    "`<role>`: The name of the role to assign. Leave blank to get a list of roles.",
  ],
  category: "server",
  run: async (message, config) => {
    try {
      const { author, channel, guild, commandArguments } = message;

      if (!guild) {
        return;
      }

      // Get role mention
      const targetRole = commandArguments.join(" ");

      // If argument is to list all roles
      if (!targetRole) {
        const roleList = new MessageEmbed();
        roleList.setColor(message.Becca.color);
        roleList.setTitle("Available Titles");
        roleList.setDescription(
          "These are the titles you may claim: \n" +
            config.self_roles.map((el) => `<@&${el}>`).join("\n")
        );

        await channel.send(roleList);
        return;
      }

      // Check for valid role
      const guildRole = guild.roles.cache.find(
        (role) => role.name === targetRole
      );

      // If not a valid role, exit.
      if (!guildRole) {
        await message.channel.send(
          "That is not a valid title. You cannot make things up here."
        );
        return;
      }

      // Check for self assignable
      if (!config.self_roles.includes(guildRole.id)) {
        await message.channel.send(
          "I cannot grant you that title. You'll need to speak to someone higher up for that."
        );
        return;
      }

      // Get guild member from role
      const member = await guild.members.fetch(author);

      // exit if no member
      if (!member) {
        await message.channel.send(
          "Hmm, it seems your membership record is missing."
        );
        return;
      }

      // If has role, remove it
      if (member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
        await channel.send(`You are no longer a \`${targetRole}\`.`);
        await message.react(message.Becca.yes);
        return;
      }

      // Add role
      await member.roles.add(guildRole);
      await channel.send(`I have made you a \`${targetRole}\` now.`);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "role command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default role;
