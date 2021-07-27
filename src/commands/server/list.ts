import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/commands/CommandInt";
import { errorEmbedGenerator } from "../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const list: CommandInt = {
  name: "list",
  description: "List all servers.",
  parameters: ["`page?`: The page of data to view."],
  category: "server",
  run: async (Becca, message) => {
    try {
      const { author, content } = message;
      if (author.id !== Becca.configs.ownerId) {
        return { success: false, content: "Only my owner may cast this spell" };
      }

      const [, rawPage] = content.split(" ");

      const targetPage = parseInt(rawPage, 10) || 1;

      const serverList = Becca.guilds.cache.map((el) => el);
      const ownerIds = [];
      const serverTexts = [];

      for (const server of serverList) {
        const owner = await server.members.fetch(server.ownerId);
        serverTexts.push(
          `${server.name} (${server.id}) owned by ${owner.user.username} (${owner.id})`
        );
        ownerIds.push(owner.id);
      }

      const totalPages = Math.ceil(serverTexts.length / 10);
      const pageData = serverTexts.slice(targetPage * 10 - 10, targetPage * 10);

      const serverEmbed = new MessageEmbed();
      serverEmbed.setTitle(`Becca's Guild List`);
      serverEmbed.setFooter(`Page ${targetPage} of ${totalPages}`);
      serverEmbed.setColor(Becca.colours.default);
      serverEmbed.setDescription(pageData.join("\n"));
      serverEmbed.addField(
        "Total servers",
        serverTexts.length.toString(),
        true
      );
      serverEmbed.addField(
        "Unique Owners",
        new Set(ownerIds).size.toString(),
        true
      );
      return { success: true, content: serverEmbed };
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "list command",
        err,
        message.guild?.name,
        message
      );
      return {
        success: false,
        content: errorEmbedGenerator(Becca, "list", errorId),
      };
    }
  },
};
