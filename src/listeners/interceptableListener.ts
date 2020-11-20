import InterceptInt from "@Interfaces/interceptor/InterceptInt";
import ListenerInt from "@Interfaces/ListenerInt";
import MessageInt from "@Interfaces/MessageInt";

export abstract class BaseInterceptableListener implements ListenerInt {
  name: string;
  description: string;
  private head?: InterceptInt;
  private tail?: InterceptInt;

  private count = 0;
  /**
   * getCount
 : number  */
  public getCount(): number {
    return this.count;
  }

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  async run(message: MessageInt): Promise<void> {
    if (this.head) {
      return await this.head.intercept(message);
    }
    return await this.action(message);
  }

  abstract action(message: MessageInt): Promise<void>;

  register(interceptor: InterceptInt): void {
    this.count += 1;
    if (!this.head) {
      this.head = interceptor;
      this.tail = interceptor;
      this.tail.setNext(this.action);
      return;
    }
    if (this.tail) {
      interceptor.next = this.action;
      this.tail.next = interceptor;
      this.tail = interceptor;
    }
  }
}
