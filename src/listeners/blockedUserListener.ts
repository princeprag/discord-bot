import ListenerInt from "@Interfaces/ListenerInt";
import BlockedUserModel from "@Models/BlockedUserModel";

const blockedUserListener: ListenerInt = {
  name: "Blocked User Listener",
  description: "Checks for blocked users",
  run: async (message) => {
    const blockCheck = await BlockedUserModel.findOne({
      userId: message.author.id,
    });
    return !!blockCheck;
  },
};

export default blockedUserListener;
