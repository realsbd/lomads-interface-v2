import { ethers } from "ethers";

export function beautifyHexToken(token: string): string {
    return (token?.slice(0, 6) + "..." + token?.slice(-4))
}

export const isAddressValid = (holderAddress: string) => {
  const ENSdomain = holderAddress.slice(-4);
  if (ENSdomain === ".eth") {
    return true;
  } else {
    const isValid: boolean = ethers.utils.isAddress(holderAddress);
    return isValid;
  }
};

export const isRightAddress = (holderAddress: string) => {
  const isValid: boolean = ethers.utils.isAddress(holderAddress);
  return isValid;
};

export const getQueryString = (params: any = {}) => {
	if(Object.keys(params).length == 0) return ''
	return `?${Object.keys(params).map(key => key + '=' + params[key]).join('&')}`;
}


const waitFor = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const retry = (promise: any, onRetry: any, maxRetries: number) => {
  const retryWithBackoff: any = async (retries: number) => {
    try {
      if (retries > 0) {
        const timeToWait = 2 ** retries * 1000;
        console.log(`waiting for ${timeToWait}ms...`);
        await waitFor(timeToWait);
      }
      return await promise();
    } catch (e) {
      if (retries < maxRetries) {
        onRetry();
        return retryWithBackoff(retries + 1);
      } else {
        console.warn("Max retries reached. Bubbling the error up");
        throw e;
      }
    }
  }
  return retryWithBackoff(0);
}