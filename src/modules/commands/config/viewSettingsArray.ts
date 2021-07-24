import { MessageEmbed } from "discord.js";
import { ServerModelInt } from "../../../database/models/ServerModel";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

export const viewSettingsArray = async (
  Becca: BeccaInt,
  config: ServerModelInt,
  setting:
    | "hearts"
    | "blocked"
    | "self_roles"
    | "anti_links"
    | "permit_links"
    | "link_roles"
    | "allowed_links",
  page: number
): Promise<MessageEmbed | null> => {
  try {
    const data = config[setting];

    const settingEmbed = new MessageEmbed();
    settingEmbed.setTitle(`Config Data for ${setting}`);
    settingEmbed.setTimestamp();
    settingEmbed.setColor(Becca.colours.default);

    if (!data || !data.length) {
      settingEmbed.setDescription("No data found.");
      return settingEmbed;
    }

    const pages = Math.ceil(data.length / 10);
    const paginatedData = data.slice(page * 10 - 10, page * 10);

    settingEmbed.setDescription(paginatedData.join("\n"));
    settingEmbed.setFooter(`Page ${page} of ${pages}`);
    return settingEmbed;
  } catch (err) {
    beccaErrorHandler(Becca, "view settings array module", err);
    return null;
  }
};
