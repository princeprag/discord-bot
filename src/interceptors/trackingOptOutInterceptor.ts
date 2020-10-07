import {
  InterceptInt,
  InterceptorAction,
  interceptorFactory,
} from "@Interfaces/interceptor/InterceptInt";
import {isTrackableUser} from "@Utils/commands/trackingList";
import { Message } from "discord.js";

export const trackingOptOutInterceptorAction: InterceptorAction = async function (
  message: Message
): Promise<boolean> {
  const { author } = message;
  const canTrackUser: boolean = isTrackableUser(author?.id);
  if (canTrackUser) {
    return await Promise.resolve(true);
  }
  return await Promise.resolve(false);
};

export const trackingOptOutInterceptor: InterceptInt = interceptorFactory(
  trackingOptOutInterceptorAction
);

export default trackingOptOutInterceptor;
