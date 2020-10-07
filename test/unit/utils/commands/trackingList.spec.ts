import { expect } from "chai";
import Sinon, { createSandbox } from "sinon";
import * as TL from "@Utils/commands/trackingList";
import {
  initializeTrackingArray,
  getTrackingOptOutIdArray,
  isTrackableUser,
} from "@Utils/commands/trackingList";



describe("trackingList", () => {
  let sandbox: Sinon.SinonSandbox;
  beforeEach(() => {
    sandbox = createSandbox();
    initializeTrackingArray(new Array<string>(), true);
  });
  
  afterEach(() => {
    
    sandbox.restore();
  });

  describe("getTrackingOptOutIdArray", () => {
    it("should return empty set", () => {
      const trackingArray: Array<string> = new Array<string>();
      initializeTrackingArray(trackingArray, true);

      expect(getTrackingOptOutIdArray()).to.deep.equal(trackingArray);
    });
  });
  describe("isTrackableUser", () => {
    describe("id provided does not match any id in set", () => {
      it("should return true", () => {
        expect(isTrackableUser("purple")).to.be.true;
      });
    });
    describe("id provided does match an id in set", () => {
      it("should return false", () => {
        const userId = "123456789";
        const trackingArray = new Array<string>();
        trackingArray.push(userId);
        initializeTrackingArray(trackingArray, true);

        const outcome = isTrackableUser("123456789");

        expect(outcome).to.be.false;
      });
    });
  });

  describe.skip("loadCurrentTrackingOptOutList", () => {});
}
);
