import { getLocation } from './getLocation';

/**
 * Get caller location (file and line)
 *
 * @param up number of levels up you want to get the call stack, default = 0, meaning, you will get the location of the caller of `getCallerLocation`
 * @returns the file and line of the caller
 */
export function getCallerLocation(up = 0) {
  return getLocation(new Error(), 'getCallerLocation', up);
}
