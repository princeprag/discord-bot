import CommandInt from "@Interfaces/CommandInt";

const role: CommandInt = {
  name: "role",
  description: "Adds or removes an assignable role from the user.",
  parameters: ["`<@role>`: The role to assign."],
  run: async (message, config) => {
    try {
      const { author, channel, guild, commandArguments } = message;

      if (!guild) {
        return;
      }

      // Get role mention
      const targetRole = commandArguments.shift();

      // If no argument provided, exit.
      if (!targetRole) {
        await message.reply(
          "Would you please try the command again, and provide the role you would like to add or remove?"
        );
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
      const memberList = await guild.members.fetch();
      const member = memberList.find((el) => el.id === author.id);

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
      console.log(
        `${message.guild?.name} had the following error with the role command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default role;
