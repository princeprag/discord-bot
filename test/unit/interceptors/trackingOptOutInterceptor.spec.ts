import { expect } from "chai";
import { Message } from "discord.js";
import { createSandbox } from "sinon";

import { trackingOptOutInterceptor } from "@Interceptors/trackingOptOutInterceptor";
import { InterceptInt } from "@Interfaces/interceptor/InterceptInt";

const sandbox = createSandbox();

describe("TrackingOptOutInterceptor", () => {
  afterEach(() => {
    trackingOptOutInterceptor.setNext();
  });
  describe("next()", () => {
    context("when next is undefined", () => {
      it("should resolve", async () => {
        trackingOptOutInterceptor.setNext(undefined);
        const val = await trackingOptOutInterceptor.intercept(null);

        expect(val).to.be.undefined;
        expect(trackingOptOutInterceptor.next).to.be.undefined;
      });
    });
    context("when next is MessageListenerHandler", () => {
      it("should await call listener", async () => {
        const messageStub = sandbox.createStubInstance<Message>(Message);
        const listenerStub = sandbox.stub();
        listenerStub.callsFake((message: Message) => {
          return Promise.resolve("hi");
        });

        trackingOptOutInterceptor.setNext(listenerStub);
        await trackingOptOutInterceptor.intercept(messageStub);

        expect(trackingOptOutInterceptor.next).to.be.equal(listenerStub);
        expect(listenerStub).to.be.calledOnceWith(messageStub);
      });
    });
    context("when next is interceptor", () => {
      it("should call intercept on next interceptor with message", async () => {
        const messageStub = sandbox.createStubInstance<Message>(Message);
        const interceptorStub: InterceptInt = {
          setNext: sandbox.stub(),
          next: sandbox.stub(),
          intercept: sandbox.stub(),
        };
        interceptorStub.intercept.resolves({});

        trackingOptOutInterceptor.setNext(interceptorStub);
        await trackingOptOutInterceptor.intercept(messageStub);

        expect(trackingOptOutInterceptor.next).to.be.equal(interceptorStub);
        expect(interceptorStub.intercept).to.be.calledOnceWith(messageStub);
      });
    });
  });
  describe("intercept", () => {
    context.skip("user not in opt-out global", () => {});
    context.skip("user in opt-out global", () => {});
  });
});
