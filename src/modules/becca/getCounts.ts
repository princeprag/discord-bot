import { CountInt } from "../../interfaces/becca/CountInt";
import { BeccaInt } from "../../interfaces/BeccaInt";

/**
 * Aggregates Becca's guild count, member counts, and
 * command counts.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @returns {CountInt} An object representing the aggregated counts.
 */
export const getCounts = (Becca: BeccaInt): CountInt => {
  const guildCount = Becca.guilds.cache.size;
  let memberCount = 0;
  let commandCount = 0;

  Becca.guilds.cache.forEach((guild) => {
    memberCount += guild.memberCount;
  });

  Becca.commands.forEach((command) => {
    const parsed = command.data.toJSON().options;
    parsed.forEach((option) => {
      // subcommands are type 1
      if (option.type === 1) {
        commandCount++;
      }
    });
  });

  commandCount += Becca.contexts.length;

  return {
    commands: commandCount,
    guilds: guildCount,
    members: memberCount,
  };
};
