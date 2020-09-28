import fetch from "node-fetch";
import { CommandInt } from "../interfaces/CommandInt";
import { WordInt } from "../interfaces/WordInt";

export const title: CommandInt = {
  prefix: "title",
  description: "Generates a title for you.",
  parameters: "*none*",
  command: async (message) => {
    const occupationData = await fetch(
      "https://api.noopschallenge.com/wordbot?set=occupations"
    );
    const occupation: WordInt = await occupationData.json();
    const adjectiveData = await fetch(
      "https://api.noopschallenge.com/wordbot?set=adjectives"
    );
    const adjective: WordInt = await adjectiveData.json();
    const moodData = await fetch(
      "https://api.noopschallenge.com/wordbot?set=moods"
    );
    const mood: WordInt = await moodData.json();
    const nounData = await fetch(
      "https://api.noopschallenge.com/wordbot?set=nouns"
    );
    const noun: WordInt = await nounData.json();
    message.channel.send(
      `Presenting <@!${message.author.id}>, the ${mood.words[0]} ${occupation.words[0]} of ${adjective.words[0]} ${noun.words[0]}!`
    );
  },
};
