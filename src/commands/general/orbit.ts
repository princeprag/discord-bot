import axios from "axios";
import { MessageEmbed } from "discord.js";
import CommandInt from "../../interfaces/CommandInt";
import { OrbitInt } from "../../interfaces/commands/OrbitInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const orbit: CommandInt = {
  name: "orbit",
  description: "Returns the Orbit community leaderboard.",
  category: "general",
  run: async (message) => {
    try {
      const { Becca, channel } = message;

      const key = process.env.ORBIT_KEY;

      if (!key) {
        await message.reply("Sorry, but I am missing access to this feature.");
        await message.react(Becca.no);
        return;
      }

      const aggregate: { name: string; love: number }[] = [];

      const data = await axios.get<OrbitInt>(
        `https://app.orbit.love/api/v1/nhcarrigan/members?items=25&sort=love`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${key}`,
          },
        }
      );

      data.data.data.forEach((user) => {
        aggregate.push({
          name: user.attributes.name,
          love: user.attributes.love,
        });
      });

      const aggregateEmbed = new MessageEmbed();

      aggregateEmbed.setTitle("Community Engagement Leaderboard");
      aggregateEmbed.setDescription(
        "This leaderboard represents our top members across all of nhcarrigan's community platforms."
      );
      aggregateEmbed.setColor(Becca.color);

      aggregate.forEach((user) => {
        aggregateEmbed.addField(user.name, `${user.love} Love points`, true);
      });

      await channel.send(aggregateEmbed);
      await message.react(Becca.yes);
    } catch (err) {
      beccaErrorHandler(
        err,
        message.guild?.name || "undefined",
        "orbit command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default orbit;
