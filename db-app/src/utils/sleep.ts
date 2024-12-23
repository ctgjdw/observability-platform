/**
 * Utility function to delay a function call. Returns a delayed promise after specified milliseconds
 *
 * @param milliseconds delay in milliseconds before the promise is returned
 */
export const sleep = async (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export default {};
