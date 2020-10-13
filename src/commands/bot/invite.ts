import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const invite: CommandInt = {
  name: "invite",
  description: "Get the invitation url of the bot to your server.",
  run: async (message) => {
    const { bot, channel } = message;

    // Send an embed message to the current channel.
    await channel.send(
      new MessageEmbed()
        .setColor(bot.color)
        .setTitle("Bot invitation")
        .setDescription(
          "Thank for your interest in adding this bot to your server, invite the bot to your server by [clicking here](https://discord.com/api/oauth2/authorize?client_id=716707753090875473&permissions=268511254&scope=bot)."
        )
        .setFooter("I feel so happy! 💜")
    );
  },
};

export default invite;
