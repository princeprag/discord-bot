import CommandInt from "@Interfaces/CommandInt";
import { generate } from "@Utils/commands/usernameGenerator";
import { MessageEmbed } from "discord.js";

const username: CommandInt = {
  name: "username",
  description:
    "Generates a username based on the Digital Ocean username generator of optional [length]",
  parameters: [
    "`<length?>` - The maximum length of the username to generate. Defaults to 30.",
  ],
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
      await message.react("791758203145945128");
    } catch (error) {
      await message.react("791758203204796446");
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the username command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the username command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default username;
