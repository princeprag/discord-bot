import { MessageEmbed } from "discord.js";
import { ServerModelInt } from "../../database/models/ServerModel";

export const viewBlockedEmbed = (
  config: ServerModelInt,
  page: number
): MessageEmbed => {
  const start = (page - 1) * 10;
  const end = page * 10;
  const blockedEmbed = new MessageEmbed()
    .setTitle("Blocked")
    .setFooter("I will not cast spells for these people.")
    .setDescription(
      config.blocked
        .map((el, i) => `#${++i}. <@!${el}> - ID: ${el}`)
        .slice(start, end)
        .join("\n") || "It seems no one here is blocked, yet."
    )
    .setFooter(`Page ${page} of ${Math.ceil(config.blocked.length / 10)}`);
  return blockedEmbed;
};
