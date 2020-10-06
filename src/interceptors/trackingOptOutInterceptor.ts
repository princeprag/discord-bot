import {
  InterceptInt,
  InterceptIntNext,
} from "@Interfaces/interceptor/InterceptInt";
import { Message } from "discord.js";

export const trackingOptOutInterceptor: InterceptInt = {
  setNext: function (next?: InterceptIntNext) {
    this.next = next;
  },
  intercept: async function (message: Message) {
    if (typeof this.next === "function") {
      return await this.next(message);
    }
    if (typeof this.next?.next === "function") {
      return await this.next.intercept(message);
    }
    return Promise.resolve();
  },
};

export default trackingOptOutInterceptor;
