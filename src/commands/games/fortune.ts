import CommandInt from "@Interfaces/CommandInt";
import fortunesList from "@Utils/commands/fortunesList";

const fortune: CommandInt = {
  name: "fortune",
  description: "Tells you a fortune.",
  run: async (message) => {
    const { channel } = message;

    // Get a random fortune number.
    const random = ~~(Math.random() * fortunesList.length - 1);

    // Send the random fortune message to the current channel.
    await channel.send(fortunesList[random]);
  },
};

export default fortune;
