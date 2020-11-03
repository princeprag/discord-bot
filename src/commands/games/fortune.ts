import CommandInt from "@Interfaces/CommandInt";
import fortunesList from "@Utils/commands/fortunesList";

const fortune: CommandInt = {
  name: "fortune",
  description: "Tells you a fortune.",
  run: async (message) => {
    try {
      const { channel } = message;

      // Get a random fortune number.
      const random = ~~(Math.random() * fortunesList.length - 1);

      // Send the random fortune message to the current channel.
      await channel.send(fortunesList[random]);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the fact command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default fortune;
