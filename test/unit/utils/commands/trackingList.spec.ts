import { expect } from "chai";
import Sinon, { createSandbox } from "sinon";
import * as TOO from "@Models/TrackingOptOutModel";
import {
  initializeTrackingArray,
  getTrackingOptOutIdArray,
  isTrackableUser,
  loadCurrentTrackingOptOutList,
} from "@Utils/commands/trackingList";

describe("trackingList", () => {
  let sandbox: Sinon.SinonSandbox;
  let find: sinon.SinonStub;

  beforeEach(() => {
    sandbox = createSandbox();
    initializeTrackingArray(new Array<string>(), true);

    find = sandbox.stub();
    find.resolves();

    sandbox.replace(TOO.TrackingOptOut, "find", find);
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

  describe("loadCurrentTrackingOptOutList", () => {
    it("should get the current set of optOutUsers and load them into TRACKING_OPT_OUT", async () => {
      const optOutUsers = new Array<TOO>();
      find.resolves(optOutUsers);

      await loadCurrentTrackingOptOutList();

      expect(find).called;
      expect(getTrackingOptOutIdArray()).to.deep.equal(optOutUsers);
    });
    context("exception occurs", () => {
      it("should log error", async () => {
        const errorLog = sandbox.spy(console, "error");
        find.rejects();

        await loadCurrentTrackingOptOutList();

        expect(find).called;
        expect(getTrackingOptOutIdArray()).to.be.empty;
        expect(errorLog).called;
      });
    });
  });
});
