import CommandInt from "../../interfaces/CommandInt";
import { generate } from "../../utils/commands/usernameGenerator";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const username: CommandInt = {
  name: "username",
  description:
    "Generates a username based on the Digital Ocean username generator of optional [length]",
  parameters: [
    "`<length?>`: The maximum length of the username to generate. Defaults to 30.",
  ],
  category: "general",
  run: async (message) => {
    try {
      const { author, channel, Becca, commandArguments } = message;

      // get length
      const lengthString = commandArguments.shift();

      // calculate length with fallback
      const length = parseInt(lengthString || "") || 30;

      // Generate username
      const username = generate(length);

      // Build embed
      const usernameEmbed = new MessageEmbed();
      usernameEmbed.setColor(Becca.color);
      usernameEmbed.setAuthor(
        `${author.username}'s new DigitalOcean Username`,
        author.avatarURL() || undefined
      );
      usernameEmbed.setDescription(
        `This feature brought to you by [MattIPv4](https://github.com/mattipv4)`
      );
      usernameEmbed.addField("Your username is...", username);
      usernameEmbed.addField(
        "Generated Length / Max Length",
        `${username.length} / ${length}`
      );

      // send it
      await channel.send(usernameEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "username command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default username;
