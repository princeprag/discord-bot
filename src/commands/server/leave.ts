import CommandInt from "@Interfaces/CommandInt";

const leave: CommandInt = {
  name: "leave",
  description:
    "Can tell the bot to leave a specific server. Gives a list of servers the bot is in. Pass the ID of the target server as the parameter to leave that server. This command is specific to the bot owner <@!465650873650118659>.",
  parameters: ["<?serverID>: the ID of the server to leave"],
  run: async (message) => {
    const { author, bot, channel, commandArguments } = message;

    const { guilds } = bot;

    // Check if the author id is not `465650873650118659`.
    if (author.id !== "465650873650118659") {
      await message.reply(
        "sorry, but only <@!465650873650118659> is allowed to use this command."
      );

      return;
    }

    // Get the next argument as the server id.
    const serverID = commandArguments.shift();

    // Check if the server id is empty.
    if (!serverID || !serverID.length) {
      let count = 0;
      await channel.send(
        `**Available servers:**\r\n${guilds.cache
          .map((guild) => `**${++count}.** ${guild.id} - ${guild.name}`)
          .join("\r\n")}`
      );

      return;
    }

    // Get the target guild.
    const targetGuild = guilds.cache.get(serverID);

    // Check if the target guild is not valid.
    if (!targetGuild) {
      await message.reply(
        `Sorry, but the \`${serverID}\` is not a valid server ID.`
      );

      return;
    }

    // Leave the target guild.
    await targetGuild.leave();
  },
};

export default leave;
