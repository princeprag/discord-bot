import {
  InterceptInt,
  InterceptorAction,
  interceptorFactory,
} from "@Interfaces/interceptor/InterceptInt";
import { isTrackableUser } from "@Utils/commands/trackingList";
import { Message } from "discord.js";

export const trackingOptOutInterceptorAction: InterceptorAction = async function (
  message: Message
): Promise<boolean> {
  const { author } = message;
  const canTrackUser: boolean = isTrackableUser(author?.id);

  return Promise.resolve(canTrackUser);
};

export function getTrackingInterceptor(): InterceptInt {
  return interceptorFactory(trackingOptOutInterceptorAction);
}

export default getTrackingInterceptor;
