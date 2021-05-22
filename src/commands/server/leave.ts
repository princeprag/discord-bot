import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import CommandInt from "../../interfaces/CommandInt";

const leave: CommandInt = {
  name: "leave",
  description:
    "Can tell Becca to leave a specific server. Pass the ID of the target server as the parameter to leave that server. This command is specific to nhcarrigan.",
  parameters: ["<?serverID>: the ID of the server to leave"],
  category: "server",
  run: async (message) => {
    try {
      const { author, Becca, commandArguments } = message;

      const { guilds } = Becca;

      // Check if the author id is not the owner id.
      if (author.id !== process.env.OWNER_ID) {
        await message.channel.send("Only nhcarrigan may cast this spell.");
        await message.react(message.Becca.no);
        return;
      }

      // Get the next argument as the server id.
      const serverID = commandArguments.shift();

      // Check if the server id is empty - return list of servers.
      if (!serverID || !serverID.length) {
        await message.channel.send("Which guild should I resign from?");
        await message.react(message.Becca.no);
        return;
      }

      // Get the target guild.
      const targetGuild = guilds.cache.get(serverID);

      // Check if the target guild is not valid.
      if (!targetGuild) {
        await message.channel.send(
          `\`${serverID}\` is not a guild I recognise.`
        );
        await message.react(message.Becca.no);
        return;
      }

      // Leave the target guild.
      await targetGuild.leave();
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "leave command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default leave;
