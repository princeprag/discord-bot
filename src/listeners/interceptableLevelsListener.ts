import { BaseInterceptableListener } from "@Listeners/interceptableListener";
import MessageInt from "@Interfaces/MessageInt";
import { getTrackingInterceptor } from "../interceptors/trackingOptOutInterceptor";
import levelsListener from "@Listeners/levelsListener";

class InterceptableLevelsListener extends BaseInterceptableListener {
  constructor() {
    super(levelsListener.name, levelsListener.description);
  }
  action(message: MessageInt): Promise<void> {
    return levelsListener.run(message);
  }
}

export const interceptedLevelsListener = new InterceptableLevelsListener();
const trackingInterceptor = getTrackingInterceptor();
interceptedLevelsListener.register(trackingInterceptor);

export default interceptedLevelsListener;
