/**
 * Helper function to pause the operation of an async function for a
 * given amount of time.
 * @param milliseconds Time, in milliseconds, to pause.
 */
export const sleep = async (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
