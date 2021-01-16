import CommandInt from "@Interfaces/CommandInt";
import { MessageEmbed } from "discord.js";

const translator = (str: string): string => {
  let end = false;
  str = str.toLowerCase();
  const mainArray = str.split(" ");
  //split each word into array
  for (let arrPos = 0; arrPos < mainArray.length; arrPos++) {
    const strArray = mainArray[arrPos].replace(/['".,!?]/g, "").split("");
    end = false;
    //word begins with vowel
    if (strArray[0].match(/[aeiou]/)) {
      strArray.push("w");
      strArray.push("a");
      strArray.push("y");
      mainArray[arrPos] = strArray.join("");
      continue;
    }
    // word begins with consonant, contains vowel
    for (let i = 1; i < strArray.length; i++) {
      if (strArray[i].match(/[aeiou]/)) {
        const pushString = strArray.splice(0, i).join("");
        strArray.push(pushString);
        strArray.push("a");
        strArray.push("y");
        mainArray[arrPos] = strArray.join("");
        end = true;
        break;
      }
    }
    // word contains no vowel
    if (!end) {
      strArray.push("a");
      strArray.push("y");
      mainArray[arrPos] = strArray.join("");
    }
  }
  //restringify
  return mainArray.join(" ");
};

const pigLatin: CommandInt = {
  name: "piglatin",
  description: "Translates the given string into piglatin.",
  category: "game",
  run: async (message) => {
    try {
      const { commandArguments, channel } = message;

      if (!commandArguments.length) {
        await message.reply(
          "Would you please try the command again, and provide the sentence you would like me to translate?"
        );
        await message.react(message.Becca.no);
        return;
      }

      // Call translation algorithm
      const translation = translator(commandArguments.join(" "));

      // Construct embed
      const pigEmbed = new MessageEmbed()
        .setTitle("Igpay Atinlay")
        .setDescription("I have translated your sentence for you!")
        .addFields(
          { name: "Original Sentence", value: commandArguments.join(" ") },
          { name: "Translated Sentence", value: translation }
        );

      await channel.send(pigEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await message.react(message.Becca.no);
      if (message.Becca.debugHook) {
        message.Becca.debugHook.send(
          `${message.guild?.name} had an error with the piglatin command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the pig latin command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default pigLatin;
