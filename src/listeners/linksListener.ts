import { defaultServer } from "../config/database/defaultServer";
import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const linksListener: ListenerInt = {
  name: "links",
  description: "Listens for links in messages where they are not allowed.",
  run: async (Becca, message, config) => {
    try {
      if (
        !config.anti_links.includes(message.channel.id) &&
        !config.anti_links.includes("all")
      ) {
        return;
      }

      if (config.permit_links.includes(message.channel.id)) {
        return;
      }

      if (message.member?.hasPermission("MANAGE_MESSAGES")) {
        return;
      }

      if (config.link_roles.length) {
        for (const role of config.link_roles) {
          if (message.member?.roles.cache.find((r) => r.id === role)) {
            return;
          }
        }
      }

      const linkRegex =
        /(([a-z]+:\/\/)?(([a-z0-9-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;

      const hasLink = linkRegex.test(message.content);

      if (hasLink) {
        message.deletable && (await message.delete());
        await message.channel.send(
          config.link_message || defaultServer.link_message
        );
      }
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "links listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
