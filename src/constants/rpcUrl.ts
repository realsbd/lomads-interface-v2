import { SupportedChainId } from "./chains"
import { INFURA_NETWORK_URLS } from "./infura"

export function getRpcUrls(chainId: SupportedChainId): [string] {
    switch (chainId) {
      case SupportedChainId.MAINNET:
      case SupportedChainId.GOERLI:
        return [INFURA_NETWORK_URLS[chainId]]
      case SupportedChainId.CELO:
        return ['https://forno.celo.org']
      case SupportedChainId.POLYGON:
        return ['https://polygon-rpc.com/']
      case SupportedChainId.BASE:
        return ['https://mainnet.base.org']
      case SupportedChainId.GNOSIS:
        return ['https://rpc.gnosischain.com']
      default:
    }
    // Our API-keyed URLs will fail security checks when used with external wallets.
    throw new Error('RPC URLs must use public endpoints')
  }
  