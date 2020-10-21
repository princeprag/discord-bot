import CommandInt from "@Interfaces/CommandInt";
import WordInt from "@Interfaces/commands/WordInt";
import axios from "axios";

const title: CommandInt = {
  name: "title",
  description: "Generates a title for you.",
  run: async (message) => {
    try {
      const { author, channel } = message;

      // Get the occupation from the noops challenge API.
      const occupation = (
        await axios.get<WordInt>(
          "https://api.noopschallenge.com/wordbot?set=occupations"
        )
      ).data.words[0];

      // Get the adjective from the noops challenge API.
      const adjective = (
        await axios.get<WordInt>(
          "https://api.noopschallenge.com/wordbot?set=adjectives"
        )
      ).data.words[0];

      // Get the mood from the noops challenge API.
      const mood = (
        await axios.get<WordInt>(
          "https://api.noopschallenge.com/wordbot?set=moods"
        )
      ).data.words[0];

      // Get the noun from the noops challenge API.
      const noun = (
        await axios.get<WordInt>(
          "https://api.noopschallenge.com/wordbot?set=nouns"
        )
      ).data.words[0];

      if (!mood || !occupation || !adjective || !noun) {
        await channel.send(
          "I am so sorry, but I seem to have lost the necessary paperwork to assign you a title."
        );
        return;
      }

      // Send the message to the current channel.
      await channel.send(
        `I present to you: ${author.toString()}, the ${mood} ${occupation} of ${adjective} ${noun}!`
      );
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the title command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default title;
