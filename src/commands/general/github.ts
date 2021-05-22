import CommandInt from "../../interfaces/CommandInt";
import { GithubInt, GithubRepoInt } from "../../interfaces/commands/GitHubInt";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

const github: CommandInt = {
  name: "github",
  description: "Gets information on the <user>'s GitHub profile.",
  parameters: ["`<user>`: The user to look for on GitHub"],
  category: "general",
  run: async (message) => {
    try {
      // Get the current channel and the command arguments of the message.
      const { channel, commandArguments } = message;

      // Get the next argument as the user.
      const user = commandArguments.shift();

      // Check if the user exists.
      if (!user) {
        await message.channel.send(
          "If I am going to go all that way, you'll need to tell me who I am looking for."
        );
        await message.react(message.Becca.no);
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
          "I hate coming back empty handed, but there weren't any records on that user."
        );
        await message.react(message.Becca.no);
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
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "github command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default github;
