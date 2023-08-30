import { SupportedChainId } from "./chains"
import { INFURA_NETWORK_URLS } from "./infura"

export function getRpcUrls(chainId: SupportedChainId): [string] {
    switch (chainId) {
      case SupportedChainId.MAINNET:
      case SupportedChainId.RINKEBY:
      case SupportedChainId.ROPSTEN:
      case SupportedChainId.KOVAN:
      case SupportedChainId.GOERLI:
        return [INFURA_NETWORK_URLS[chainId]]
      case SupportedChainId.OPTIMISM:
        return ['https://mainnet.optimism.io']
      case SupportedChainId.OPTIMISTIC_KOVAN:
        return ['https://kovan.optimism.io']
      case SupportedChainId.ARBITRUM_ONE:
        return ['https://arb1.arbitrum.io/rpc']
      case SupportedChainId.ARBITRUM_RINKEBY:
        return ['https://rinkeby.arbitrum.io/rpc']
      case SupportedChainId.POLYGON:
        return ['https://polygon-rpc.com/']
      case SupportedChainId.POLYGON_MUMBAI:
        return ['https://rpc-mumbai.matic.today']
        case SupportedChainId.BASE:
          return['https://mainnet.base.org']
      default:
    }
    // Our API-keyed URLs will fail security checks when used with external wallets.
    throw new Error('RPC URLs must use public endpoints')
  }
  