import AppInformation from "../types/response/AppInformation";

/**
 * Get application information.
 *
 * @returns {AppInformation}
 */
export const getAppInfo = (): AppInformation => {
  return { NAME: 'te', VERSION: '1.0.0' };
};
