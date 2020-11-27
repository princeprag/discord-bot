import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const role: CommandInt = {
  name: "role",
  description: "Adds or removes an assignable role from the user.",
  parameters: [
    "`<role>`: The name of the role to assign. Optionally use `listall` to get a list of roles.",
  ],
  run: async (message, config) => {
    try {
      const { author, channel, guild, commandArguments } = message;

      if (!guild) {
        return;
      }

      // Get role mention
      const targetRole = commandArguments.join(" ");

      // If no argument provided, exit.
      if (!targetRole) {
        await message.reply(
          "Would you please try the command again, and provide the role you would like to add or remove?"
        );
        return;
      }

      // If argument is to list all roles
      if (targetRole === "listall") {
        const roleList = new MessageEmbed();
        roleList.setColor(message.Becca.color);
        roleList.setTitle("Self-Assignable Roles");
        roleList.setDescription(
          "These are the roles you can assign yourself: \n" +
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
        await message.reply(
          "I am so sorry, but that does not appear to be a valid role."
        );
        return;
      }

      // Check for self assignable
      if (!config.self_roles.includes(guildRole.id)) {
        await message.reply(
          "I am so sorry, but I am not permitted to assign that role."
        );
        return;
      }

      // Get guild member from role
      const member = await guild.members.fetch(author);

      // exit if no member
      if (!member) {
        await message.reply(
          "I am so sorry, but I cannot find your member record."
        );
        return;
      }

      // If has role, remove it
      if (member.roles.cache.has(guildRole.id)) {
        await member.roles.remove(guildRole);
        await channel.send(`Okay, I have removed your \`${targetRole}\` role.`);
        return;
      }

      // Add role
      await member.roles.add(guildRole);
      await channel.send(`Okay, I have given you the \`${targetRole}\` role.`);
      return;
    } catch (error) {
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the role command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the role command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default role;
