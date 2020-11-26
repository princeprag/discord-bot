import CommandInt from "@Interfaces/CommandInt";

const roll: CommandInt = {
  name: "roll",
  description: "Rolls a random die for you of **number** sides.",
  parameters: [
    "`<d number`>: number of sides to use on die; **must** be prefaced with the letter d, like d20",
  ],
  run: async (message) => {
    try {
      const { channel, commandArguments } = message;

      // Get the next argument as `num`.
      const num = commandArguments.shift();

      // Check if the num is valid.
      if (!num) {
        await message.reply(
          "Would you please try the command again, and tell me what `num` die you want me to roll?"
        );
        return;
      }

      // Check if the num starts with `d`.
      if (!num.startsWith("d")) {
        await message.reply(
          "Would you please try the command again, and be sure that your die value starts with `d`? For example, `d20` is a 20-sided die."
        );
        return;
      }

      // Get the number after the `d`.
      const numValue = Number(num.slice(1));

      // Check if the number is NaN.
      if (isNaN(numValue)) {
        await message.reply(`I am so sorry, but ${num} is not a valid number.`);
        return;
      }

      // Get a random number.
      const result = ~~(Math.random() * numValue + 1);

      // Send the result to the current channel.
      await channel.send(
        `You rolled a ${numValue}-sided die and got: ${result}`
      );
    } catch (error) {
      if (message.bot.debugHook) {
        message.bot.debugHook.send(
          `${message.guild?.name} had an error with the roll command. Please check the logs.`
        );
      }
      console.log(
        `${message.guild?.name} had the following error with the roll command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default roll;
