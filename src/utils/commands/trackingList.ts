import { TrackingOptOut, TrackingOptOutInt } from "@Models/TrackingOptOutModel";

export let TRACKING_OPT_OUT: Array<string>;

export const loadCurrentTrackingOptOutList = async (): Promise<void> => {
  return TrackingOptOut.find()
    .then((data: TrackingOptOutInt[]) => {
      const trackingOptOutIds = data.map(
        (user: TrackingOptOutInt) => user.user_id
      );
      initializeTrackingArray(trackingOptOutIds);
    })
    .catch((error: Error) => {
      console.error(
        `Error occured when fetching current set of opt-out users`,
        error
      );
    });
};

export const initializeTrackingArray = (
  startArray: Array<string>,
  clear?: boolean
): void => {
  if (clear || typeof TRACKING_OPT_OUT === "undefined") {
    TRACKING_OPT_OUT = new Array<string>();
  }

  startArray.every((val: string) => TRACKING_OPT_OUT.push(val));
};

export const isTrackableUser = (id: string): boolean => {
  if (typeof TRACKING_OPT_OUT === "undefined") {
    TRACKING_OPT_OUT = new Array<string>();
  }
  return TRACKING_OPT_OUT.includes(id) === false;
};

export function getTrackingOptOutIdArray(): Array<string> {
  return TRACKING_OPT_OUT;
}
