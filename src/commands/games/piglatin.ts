import CommandInt from "../../interfaces/CommandInt";
import { MessageEmbed } from "discord.js";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

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
        await message.reply("But what do you want me to translate?");
        await message.react(message.Becca.no);
        return;
      }

      // Call translation algorithm
      const translation = translator(commandArguments.join(" "));

      // Construct embed
      const pigEmbed = new MessageEmbed()
        .setTitle("Igpay Atinlay")
        .setDescription("Here is your translation:")
        .addFields(
          { name: "Original Sentence", value: commandArguments.join(" ") },
          { name: "Translated Sentence", value: translation }
        );

      await channel.send(pigEmbed);
      await message.react(message.Becca.yes);
    } catch (error) {
      await beccaErrorHandler(
        error,
        message.guild?.name || "undefined",
        "piglatin command",
        message.Becca.debugHook,
        message
      );
    }
  },
};

export default pigLatin;
