import { BaseInterceptableListener } from "@Listeners/interceptableListener";
import MessageInt from "@Interfaces/MessageInt";
import usageListener from "@Listeners/usageListener";

class InterceptableUsageListener extends BaseInterceptableListener {
  constructor() {
    super(usageListener.name, usageListener.description);
  }
  action(message: MessageInt): Promise<void> {
    return usageListener.run(message) as Promise<void>;
  }
}

export const interceptedUsageListener = new InterceptableUsageListener();

export default interceptedUsageListener;
