// @ts-nocheck 
import Safe, { EthersAdapter, SafeFactory, SafeAccountConfig  } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
// import Safe from "@gnosis.pm/safe-core-sdk";
// import SafeServiceClient from "@gnosis.pm/safe-service-client";
import { ethers } from "ethers";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'

export const ImportSafe = async (provider: any, safeAddress: string) => {
  const safeOwner = provider?.getSigner(0);
  console.log("ImportSafe", safeOwner)
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner as any,
  });
  console.log("ImportSafe", ethAdapter)
  const safeSDK: Safe = await Safe.create({ethAdapter: ethAdapter, safeAddress });
  console.log("ImportSafe", provider, safeAddress, safeSDK)
  return safeSDK;
};

export const safeService = async (provider: any, chainId: string) => {
  const safeOwner = provider?.getSigner(0);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner as any,
  });
  const txServiceUrl = GNOSIS_SAFE_BASE_URLS[chainId];
  const safeService = new SafeApiKit({  txServiceUrl, ethAdapter })
  console.log("safeService", safeService)
  return safeService;
};
