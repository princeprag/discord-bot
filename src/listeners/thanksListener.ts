import { ListenerInt } from "../interfaces/listeners/ListenerInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const thanksListener: ListenerInt = {
  name: "Thanks",
  description: "Recognise users who are thanked.",
  run: async (Becca, message, config) => {
    try {
      const { author, channel, content, mentions } = message;
      if (config.thanks !== "on") {
        return;
      }

      const thanksRegex =
        /((?:^|\s)(?:(?:th(?:n[qx]|x)|t[xyq]|tn(?:[x]){0,2})|\w*\s*[.,]*\s*than[kx](?:[sxz]){0,2}|than[kx](?:[sxz]){0,2}(?:[uq]|y(?:ou)?)?)|grazie|arigato(?:[u]{0,1})|doumo|gracias?|spasibo|dhanyavaad(?:hamulu)?|o?brigad(?:o|a)|dziekuje|(?:re)?merci|multumesc|shukra?an|danke)\b/gi;
      if (!thanksRegex.test(content) || !mentions.users.size) {
        return;
      }

      const replies = [];
      const users = mentions.users.map((u) => u);

      for (const user of users) {
        if (user.id === Becca.user?.id) {
          replies.push(
            "You are quite welcome. But do not expect my constant help."
          );
          continue;
        }
        if (user.id === author.id) {
          replies.push(
            "I suppose you need a pat on the back badly enough to thank yourself."
          );
          continue;
        }
        replies.push(
          `Well done, ${user.username}. It seems you have done something right.`
        );
      }
      await channel.send(replies.join("\n"));
    } catch (err) {
      beccaErrorHandler(
        Becca,
        "thanks listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
