import { BaseInterceptableListener } from "@Listeners/interceptableListener";
import MessageInt from "@Interfaces/MessageInt";
import levelsListener from "@Listeners/levelsListener";

class InterceptableLevelsListener extends BaseInterceptableListener {
  constructor() {
    super(levelsListener.name, levelsListener.description);
  }
  action(message: MessageInt): Promise<void> {
    return levelsListener.run(message) as Promise<void>;
  }
}

export const interceptedLevelsListener = new InterceptableLevelsListener();

export default interceptedLevelsListener;
