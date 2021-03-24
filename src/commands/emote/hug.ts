import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

const hug: CommandInt = {
  name: "hug",
  description: "Gives the <@user> a hug.",
  parameters: ["`<@user> - the user to hug"],
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
        await message.reply("Sorry, but who did you want me to hug?");
        await message.react(Becca.no);
        return;
      }

      if (target === author) {
        await message.reply("Aww, are you lonely? Do you need a hug?");
        emoteEmbed.setTitle("HUG!");
        emoteEmbed.setDescription(`<@!${user?.id}> hugs <@!${author.id}>`);
        await message.channel.send(emoteEmbed);
        await message.react(Becca.yes);
        return;
      }

      if (target === user) {
        await message.channel.send("You're giving me a hug? You're so sweet!");
        await message.react(Becca.yes);
        return;
      }

      emoteEmbed.setTitle("HUG!");
      emoteEmbed.setDescription(
        `<@!${author.id}> hugs <@!${target.id}>! How sweet!`
      );
      await message.channel.send(emoteEmbed);
      await message.react(Becca.yes);
      return;
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "hug command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default hug;
