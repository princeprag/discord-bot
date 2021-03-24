import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const tickle: CommandInt = {
  name: "tickle",
  description: "Tickles the <@user>.",
  parameters: ["`<@user> - the user to tickle"],
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
        await message.reply("Sorry, but who did you want me to tickle?");
        await message.react(Becca.no);
        return;
      }

      if (target === author) {
        await message.reply("I don't believe you can tickle yourself...");
        await message.react(Becca.no);
        return;
      }

      if (target === user) {
        await message.channel.send("OH NO!");
        emoteEmbed.setTitle("TICKLE!");
        emoteEmbed.setDescription(
          `<@!${author.id} tried to tickle <@!${user?.id}>, but she ran away.`
        );
        await message.channel.send(emoteEmbed);
        await message.react(Becca.yes);
        return;
      }

      emoteEmbed.setTitle("TICKLE!");
      emoteEmbed.setDescription(
        `<@!${author.id}> tickles <@!${target.id}>! Glad that's not me!`
      );
      await message.channel.send(emoteEmbed);
      await message.react(Becca.yes);
      return;
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "tickle command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default tickle;
