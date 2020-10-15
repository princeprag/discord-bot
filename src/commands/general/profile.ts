import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const profile: CommandInt = {
  name: "profile",
  description:
    "Returns a profile for the selected **user** on the **website**. Supported websites: Steam, Facebook, GitHub, Twitter, LinkedIn, Tumblr, and Instagram.",
  parameters: [
    "`<website>`: name of the website to search",
    "`<user>`: username or ID of the user to find",
  ],
  run: async (message) => {
    const { bot, channel, commandArguments } = message;

    // Get the next argument as the website.
    const website = commandArguments.shift();

    // Check if there is no website provided
    if (!website) {
      await message.reply(
        "Would you please provide the website you want me to search for?"
      );
      return;
    }

    // Check if the website is not valid.
    if (
      ![
        "steam",
        "facebook",
        "fb",
        "github",
        "gh",
        "twitter",
        "tw",
        "linkedin",
        "tumblr",
        "instagram",
        "ig",
      ].includes(website)
    ) {
      await message.reply(
        `I am so sorry, but I do not have access to ${website}`
      );
      return;
    }

    // Get the next argument as the user.
    let user = commandArguments.shift();

    // Check if the user is empty.
    if (!user) {
      await message.reply(
        "Would you please provide the user you want me to search for?"
      );
      return;
    }

    let prefix = "";

    if (website === "stream") {
      prefix = "https://steamcommunity.com/id/";
    } else if (website === "facebook" || website === "fb") {
      prefix = "https://facebook.com/";
    } else if (website === "github" || website === "gh") {
      prefix = "https://github.com/";
    } else if (website === "twitter" || website === "tw") {
      prefix = "https://twitter.com/";
    } else if (website === "linkedin") {
      prefix = "https://linkedin.com/in/";
    } else if (website === "tumblr") {
      prefix = "https://";
      user = user + ".tumblr.com";
    } else if (website === "instagram" || website === "ig") {
      prefix = "https://instagram.com/";
    }

    // Send an embed to the current channel.
    await channel.send(
      new MessageEmbed()
        .setColor(bot.color)
        .setTitle(`Query: ${website} | For user: ${user}`)
        .setDescription(
          `I found them! Here is a [link to their profile](${prefix}${user})`
        )
    );
  },
};

export default profile;
