import CommandInt from "@Interfaces/CommandInt";

const leave: CommandInt = {
  name: "leave",
  description:
    "Can tell Becca to leave a specific server. Pass the ID of the target server as the parameter to leave that server. This command is specific to nhcarrigan.",
  parameters: ["<?serverID>: the ID of the server to leave"],
  run: async (message) => {
    try {
      const { author, Becca, commandArguments } = message;

      const { guilds } = Becca;

      // Check if the author id is not the owner id.
      if (author.id !== process.env.OWNER_ID) {
        await message.reply(
          "I am so sorry, but I can only do this for nhcarrigan."
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the next argument as the server id.
      const serverID = commandArguments.shift();

      // Check if the server id is empty - return list of servers.
      if (!serverID || !serverID.length) {
        await message.reply(
          "Would you please try the command again, and provide the server ID you wish for me to leave?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Get the target guild.
      const targetGuild = guilds.cache.get(serverID);

      // Check if the target guild is not valid.
      if (!targetGuild) {
        await message.reply(
          `I am so sorry, but \`${serverID}\` is not a valid server ID.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Leave the target guild.
      await targetGuild.leave();
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the leave command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the leave command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default leave;
