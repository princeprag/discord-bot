import { ActivityOptOut } from "../../config/optout/ActivityOptOut";
import ActivityModel from "../../database/models/ActivityModel";
import { BeccaInt } from "../../interfaces/BeccaInt";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

export const logActivity = async (
  Becca: BeccaInt,
  user: string,
  activity: "button" | "command" | "select" | "context"
): Promise<void> => {
  try {
    if (ActivityOptOut.includes(user)) {
      return;
    }
    const userActivity =
      (await ActivityModel.findOne({ userId: user })) ||
      (await ActivityModel.create({
        userId: user,
        buttons: 0,
        commands: 0,
        selects: 0,
        contexts: 0,
      }));

    switch (activity) {
      case "button":
        userActivity.buttons++;
        break;
      case "command":
        userActivity.commands++;
        break;
      case "select":
        userActivity.selects++;
        break;
      case "context":
        userActivity.contexts++;
        break;
      default:
        break;
    }

    await userActivity.save();
  } catch (err) {
    beccaErrorHandler(Becca, "activity logger", err);
  }
};
