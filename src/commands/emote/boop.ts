import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
        await message.channel.send("Sorry, but who did you want me to boop?");
        await message.react(Becca.no);
        return;
      }

      if (target === author) {
        await message.channel.send("Booping yourself? Cute!");
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
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "boop command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default boop;
