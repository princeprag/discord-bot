import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const boop: CommandInt = {
  name: "boop",
  description: "Gives the <@user> a boop.",
  parameters: ["`<@user> - the user to boop"],
  category: "emote",
  run: async (message) => {
    try {
      const { author, guild, Becca, mentions } = message;
      const { color, user } = Becca;

      if (!guild) {
        await message.react(Becca.no);
        return;
      }

      const emoteEmbed = new MessageEmbed();
      emoteEmbed.setColor(color);

      const target = mentions.users.first();

      if (!target) {
        await message.reply("Sorry, but who did you want me to boop?");
        await message.react(Becca.no);
        return;
      }

      if (target === author) {
        await message.reply("Booping yourself? Cute!");
        await message.react(Becca.yes);
        return;
      }

      if (target === user) {
        await message.channel.send("EEK! I'll get you back!");
        emoteEmbed.setTitle("BOOP!");
        emoteEmbed.setDescription(
          `<@!${user?.id}> boops <@!${author.id}>! I told you I'd get you!`
        );
        await message.channel.send(emoteEmbed);
        await message.react(Becca.yes);
        return;
      }

      emoteEmbed.setTitle("BOOP!");
      emoteEmbed.setDescription(
        `<@!${author.id}> boops <@!${target.id}>! Hehe!`
      );
      await message.channel.send(emoteEmbed);
      await message.react(Becca.yes);
      return;
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the boop command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the boop command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default boop;
