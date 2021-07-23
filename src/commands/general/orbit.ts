import axios from "axios";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import {
  IndividualOrbitInt,
  OrbitInt,
} from "../../interfaces/commands/general/OrbitInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const orbit: CommandInt = {
  name: "orbit",
  description: "Returns the Orbit community leaderboard",
  category: "general",
  parameters: [],
  run: async (Becca, message) => {
    try {
      const { author } = message;

      const data = await axios.get<OrbitInt>(
        "https://app.orbit.love/api/v1/nhcarrigan/members?items=10&sort=love",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${Becca.configs.orbitKey}`,
          },
        }
      );

      const orbitEmbed = new MessageEmbed();
      orbitEmbed.setTitle("nhcommunity Engagement Leaderboard");
      orbitEmbed.setDescription(
        "This leaderboard represents the global contributions for all of nhcarrigan's party members"
      );
      orbitEmbed.setColor(Becca.colours.default);
      orbitEmbed.setTimestamp();

      data.data.data.forEach((user) => {
        orbitEmbed.addField(
          user.attributes.name,
          user.attributes.love + " love points",
          true
        );
      });

      const authorData = await axios.get<IndividualOrbitInt>(
        `https://app.orbit.love/api/v1/nhcarrigan/members/find?source=discord&username=${author.username}%23${author.discriminator}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${Becca.configs.orbitKey}`,
          },
          validateStatus: null,
        }
      );

      const authorString = authorData.data.data
        ? `${author.username} has ${authorData.data.data.attributes.love} love points.`
        : `${author.username} has no Orbit record.`;

      orbitEmbed.addField("Your rank:", authorString);

      return { success: true, content: orbitEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "orbit command",
        err,
        message.guild?.name,
        message
      );
      return { success: false, content: errorEmbedGenerator(Becca, "orbit", errorId) };
    }
  },
};
