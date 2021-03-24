import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "@Utils/beccaErrorHandler";

const sponsor: CommandInt = {
  name: "sponsor",
  description: "Returns an embed containing the sponsor links.",
  category: "bot",
  run: async (message) => {
    try {
      const { channel, Becca } = message;

      //create embed
      const sponsorEmbed = new MessageEmbed()
        .setTitle("Sponsor my development!")
        .setDescription(
          "Are you interested in sponsoring my development and helping fund my improvement? Thank you very much! Words cannot express my appreciation!"
        )
        .setColor(Becca.color)
        .addFields(
          {
            name: "Monthly Donation",
            value:
              "You can sign up for a monthly donation through [GitHub Sponsors](https://github.com/sponsors/nhcarrigan). There are plenty of rewards available!",
          },
          {
            name: "One-time Donation",
            value:
              "You can make a one-time donation through [Ko-Fi](https://ko-fi.com/nhcarrigan), though there are no rewards here aside from my love and apprecaition.",
          }
        );
      await channel.send(sponsorEmbed);
      await message.react(Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "sponsor command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default sponsor;
