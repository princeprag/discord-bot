/* eslint-disable jsdoc/require-jsdoc */
import { MessageEmbed } from "discord.js";

import { defaultServer } from "../config/database/defaultServer";
import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Checks if the message content includes a link, and confirms that link
 * has not been set as allowed and the user does not have a link-permitted role.
 *
 * If the message fails these conditions, Becca deletes it. Requires that this listener
 * be enabled in the server AND channel.
 */
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

      const linkRegex =
        /(^|\s+)(([a-z]+:\/\/)?(([a-z0-9-]+\.)+((?!txt|json|css|jsx|html|rss|csh|act|ash|rby|pyc|java|vue|php|ashx|xml|rss|cpp|scss|vue|class|ogg|wav|wpp|pkg|deb|rpm|tar.gz|zip|dmg|iso|toast|db.sqlite3|csv|mdb|sql|tar|msg|emlx|vcf|bat|apk|exe|gadget|wsf|fnt|font|gif|bmp|icon|jpeg|tiff|asp|aspx|cer|htm|jsp|rss|xhtml|key|pps|ppt|pptx|odp|swift|xlsx|dll|bak|cab|cfg|ini|drv|icns|tmp|cur|avi|flv|mpg|mpeg|swf|mov|doc|docx|pdf|rtx|tex|wpd|)[a-z]{3,4}|io|me|gg|to|uk|be|in|eu|ru|us|za|))(:[0-9]{1,5})?(.*\s+|\/|$)/gi;

      blockedLinks += (message.content.match(linkRegex) || []).length;

      if (blockedLinks > 0 && blockedLinks !== allowedLinks) {
        message.deletable && (await message.delete());
        const linkEmbed = new MessageEmbed();
        linkEmbed.setTitle("Invalid Link Detected!");
        linkEmbed.setDescription(
          (config.link_message || defaultServer.link_message).replace(
            /\{@username\}/g,
            `<@!${message.author.id}>`
          )
        );
        linkEmbed.setColor(Becca.colours.error);
        linkEmbed.setAuthor(
          `${message.author.username}#${message.author.discriminator}`,
          message.author.displayAvatarURL()
        );
        await message.channel.send({ embeds: [linkEmbed] });
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
