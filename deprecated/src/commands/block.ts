import CommandInt from "@Interfaces/CommandInt";
import BlockedUserModel from "@Models/BlockedUserModel";

const block: CommandInt = {
  name: "block",
  description: "Adds or removes a user from the blocked list of users.",
  parameters: [
    "`<?add|remove>`: add or remove the user",
    "`<?@username>`: user mention to add/remove",
  ],
  run: async (message) => {
    try {
      const { author, commandArguments, channel } = message;

      // Check for add/remove
      const action = commandArguments.shift();

      // Lock command to bot owner
      if (author.id !== process.env.OWNER_ID) {
        await message.reply(
          `I am so sorry, but I can only do this for <@!${process.env.OWNER_ID}>.`
        );
        return;
      }

      // Check for invalid actions
      if (action !== "add" && action !== "remove") {
        await message.reply(
          "Would you please try the command again, and tell me if you want to `add` or `remove` a user?"
        );
        return;
      }

      const target = message.mentions.users.first();

      // Check for valid mention
      if (!target) {
        await message.reply(
          "Would you please try the command again, and provide the user you want to add/remove?"
        );
        return;
      }

      // Failsafe to prevent accidental self-block
      if (target.id === author.id) {
        await message.reply("I am so sorry, but you cannot block yourself!");
        return;
      }

      // Check database for existing user.
      const existingData = await BlockedUserModel.findOne({
        userId: target.id,
      });

      // User is not blocked
      if (!existingData) {
        // Block the user
        if (action === "add") {
          await BlockedUserModel.create({
            userId: target.id,
            username: target.username,
          });
          await channel.send(`Okay, I will not help <@!${target.id}> anymore.`);
          return;
        }

        // Cannot unblock a user who is not blocked
        await channel.send(`I am already helping <@!${target.id}>.`);
        return;
      }

      // Cannot block a user who is already blocked
      if (action === "add") {
        await channel.send(`I am already refusing to help <@!${target.id}>.`);
        return;
      }

      // Unblock user
      await existingData.deleteOne();
      await channel.send(`Okay, I will go back to helping <@!${target.id}>.`);
    } catch (error) {
      console.log(
        `${message.guild?.name} had the following error with the listeners command:`
      );
      console.log(error);
      message.reply("I am so sorry, but I cannot do that at the moment.");
    }
  },
};

export default block;
