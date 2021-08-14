import { MessageEmbed } from "discord.js";

export const migrationEmbedGenerator = (commandCall: string): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setTitle("Command Migrated!");
  embed.setDescription(
    "This command has been migrated to use the new slash command interface. Try typing `/` to see the available commands!"
  );
  embed.addField(
    "New Command",
    `You can now find this command under \`/${commandCall}\``
  );
  embed.addField(
    "Migration Details",
    "Here are the [instructions to allow slash commands in your server](https://github.com/BeccaLyria/discord-bot/issues/744)."
  );
  embed.addField(
    "Need help?",
    "You can [join our support server](https://links.nhcarrigan.com/discord) where we would be happy to assist you!"
  );
  embed.setColor(0x00ff00);
  return embed;
};
