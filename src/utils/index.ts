import { ethers } from "ethers";

export function beautifyHexToken(token: string): string {
  return (token?.slice(0, 6) + "..." + token?.slice(-4))
}

export const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!urlPattern.test(urlString);
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
