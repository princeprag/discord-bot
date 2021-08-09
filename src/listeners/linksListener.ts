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

      if (message.member?.permissions.has("MANAGE_MESSAGES")) {
        return;
      }

      let blockedLinks = 0;
      let allowedLinks = 0;

      if (config.allowed_links.length) {
        for (const str of config.allowed_links) {
          const regex = new RegExp(str, "ig");
          allowedLinks += (message.content.match(regex) || []).length;
        }
      }

      if (config.link_roles.length) {
        for (const role of config.link_roles) {
          if (message.member?.roles.cache.find((r) => r.id === role)) {
            return;
          }
        }
      }

      // Borrowed from https://gist.github.com/arbales/1654670
      const linkRegex =
        /(([a-z]+:\/\/)?(([a-z0-9-]+\.)+([a-z]{2,3}|aero|arpa|coop|info|jobs|museum|name|nato|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-.~]+)*(\/([a-z0-9_\-.]*)(\?[a-z0-9+_\-.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;

      blockedLinks += (message.content.match(linkRegex) || []).length;

      if (blockedLinks > 0 && blockedLinks !== allowedLinks) {
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
