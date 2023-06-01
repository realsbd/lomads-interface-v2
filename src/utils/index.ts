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