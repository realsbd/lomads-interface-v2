/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  BASE = 8453
}

export const CHAIN_IDS_TO_NAMES = {
  [`${SupportedChainId.MAINNET}`]: 'mainnet',
  [`${SupportedChainId.ROPSTEN}`]: 'ropsten',
  [`${SupportedChainId.RINKEBY}`]: 'rinkeby',
  [`${SupportedChainId.GOERLI}`]: 'goerli',
  [`${SupportedChainId.KOVAN}`]: 'kovan',
  [`${SupportedChainId.POLYGON}`]: 'polygon',
  [`${SupportedChainId.POLYGON_MUMBAI}`]: 'polygon mumbai',
  [`${SupportedChainId.ARBITRUM_ONE}`]: 'arbitrum',
  [`${SupportedChainId.ARBITRUM_RINKEBY}`]: 'arbitrum_rinkeby',
  [`${SupportedChainId.OPTIMISM}`]: 'optimism',
  [`${SupportedChainId.OPTIMISTIC_KOVAN}`]: 'optimistic_kovan',
  [`${SupportedChainId.BASE}`]: 'Base'
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]

export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.GOERLI,
  SupportedChainId.BASE
]

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
]

/**
 * Unsupported networks for V2 pool behavior.
 */
export const UNSUPPORTED_V2POOL_CHAIN_IDS = [
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

export const GNOSIS_SAFE_BASE_URLS:any = {
  [SupportedChainId.MAINNET]: 'https://safe-transaction-mainnet.safe.global',
  [SupportedChainId.GOERLI]: 'https://safe-transaction-goerli.safe.global',
  [SupportedChainId.POLYGON]: 'https://safe-transaction-polygon.safe.global',
  [SupportedChainId.BASE]: 'https://safe-transaction-base.safe.global/'
}

export const GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT :any = {
  [SupportedChainId.GOERLI]: '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134',
  [SupportedChainId.POLYGON]: '0x1Fb403834C911eB98d56E74F5182b0d64C3b3b4D',
  [SupportedChainId.MAINNET]: '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134',
  [SupportedChainId.BASE]: '0xCFbFaC74C26F8647cBDb8c5caf80BB5b32E43134'
}

export const CHAIN_GAS_STATION :any = {
  [SupportedChainId.POLYGON]: {
    url: 'https://gasstation-mainnet.matic.network/v2',
    symbol: 'GWei'
  },
  [SupportedChainId.GOERLI]: ''
}

export const SUPPORTED_ASSETS = {
  [`${SupportedChainId.GOERLI}`]: {
    id: "ethereum",
    symbol: "ETH",
  },
  [`${SupportedChainId.POLYGON}`]: {
    id: "wmatic",
    symbol: "MATIC",
  },
  [`${SupportedChainId.BASE}`]: {
    id: "ethereum",
    symbol: "ETH"
  }
};



  export const WEB3AUTH_NETWORK = {
    mainnet: {
      displayName: "Mainnet",
      clientId: "BB7Cycr4trvRLqKMQViPrMUz5pJ2OTezkMzezdvoZ3wYvtepFGqOWwJBOZVTMtcmZNgBKsMUqGi5NZ9xvJjNThw",
      googleClientId: "490211141645-b4jreehsanlfkf8ag88c8rq1q2f4603d.apps.googleusercontent.com"
    },
    testnet: {
      displayName: "Testnet",
      clientId: "BPtseKNlLAexW69f-3RI3smDoUg4JH0OUdq5yckWnIfs78EP_GDpHQTS66q8cVihnjXHulzGP9mUh5wdpRajQns",
      googleClientId: "490211141645-6gbbufuedlrnq8s2ilmq21nkq30aguh4.apps.googleusercontent.com"
    },
    cyan: {
      displayName: "Cyan",
      clientId: "BHI9J8T5iU84wSJunaui1EABfRAvlBlxg-iN86jUXbi4IZ9uGOcqh5pJSBwsag0ObEA1eC1KiBvEDVcAZN0FU84",
      googleClientId: "490211141645-b4jreehsanlfkf8ag88c8rq1q2f4603d.apps.googleusercontent.com"
    },
  } as const;
  
  export type WEB3AUTH_NETWORK_TYPE = keyof typeof WEB3AUTH_NETWORK;