import CommandInt from "@Interfaces/CommandInt";
import { GithubInt, GithubRepoInt } from "@Interfaces/commands/GitHubInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const github: CommandInt = {
  name: "github",
  description: "Gets information on the <user>'s GitHub profile.",
  parameters: ["`<user>`: The user to look for on GitHub"],
  run: async (message) => {
    try {
      // Get the current channel and the command arguments of the message.
      const { channel, commandArguments } = message;

      // Get the next argument as the user.
      const user = commandArguments.shift();

      // Check if the user exists.
      if (!user) {
        await message.reply(
          "Would you please try the command again, and provide the username you want me to search for?"
        );
        return;
      }

      // Get the user data from GitHub.
      const ghUserData = await axios.get(
        `https://api.github.com/users/${user}`
      );

      // Get the user from the GitHub profile result.
      const ghUser: GithubInt = ghUserData.data;

      // Check if the user exists on GitHub.
      if (ghUser.message === "Not Found") {
        await channel.send(
          "I am so sorry, but I was not able to find anything..."
        );
        return;
      }

      // Get the user repositories data from GitHub.
      const ghRepoData = await axios.get(
        `https://api.github.com/users/${user}/repos?sort=updated`
      );

      // Get the user repositories from the GitHub profile result.
      const ghRepo: GithubRepoInt[] = ghRepoData.data;

      // Create a new empty embed.
      const ghEmbed = new MessageEmbed();

      // Add the author (GitHub image, username and url)
      ghEmbed.setAuthor(
        `${ghUser.login}'s GitHub profile`,
        ghUser.avatar_url,
        ghUser.html_url
      );

      // Add the description (GitHub biography)
      ghEmbed.setDescription(ghUser.bio || "No biography provided.");

      // Check if the user has repositories.
      if (ghRepo.length) {
        // Get the first 5 repositories and get as markdown url.
        const repositories = ghRepo
          .slice(0, 5)
          .map((repo) => `[${repo.name}](${repo.html_url})`);

        // Add the recently updates repositories.
        ghEmbed.addField("Recently updated", repositories.join(" | "));
      }

      // Add the GitHub name.
      ghEmbed.addField("Name", ghUser.name, true);

      // Add the GitHub followers count,
      ghEmbed.addField("Followers", ghUser.followers, true);

      // Add the GitHub following count.
      ghEmbed.addField("Following", ghUser.following, true);

      // Add the GitHub join date.
      ghEmbed.addField(
        "Join date",
        new Date(ghUser.created_at).toLocaleDateString(),
        true
      );

      // Add the GitHub account type.
      ghEmbed.addField("Account type", ghUser.type, true);

      // Add the GitHub public repositories count.
      ghEmbed.addField("Public repositories", ghUser.public_repos, true);

      // Send the embed to the current channel.
      await channel.send(ghEmbed);
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the github command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the github command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default github;
