import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {  get as _get, find as _find } from 'lodash'
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS, SupportedChainId } from 'constants/chains';
import { CHAIN_INFO } from "constants/chainInfo";
import axiosHttp from '../api'
import { useAppSelector } from "helpers/useAppSelector";

export const SafeTokensContext = createContext<any>({
    safeTokens: null
})

export function useSafeTokens(): any {
    return useContext(SafeTokensContext);
}

export const SafeTokensProvider = ({ children }: any) => {
    //@ts-ignore
    const { DAO } = useAppSelector(store => store?.dao)
    const [safeTokens, setSafeTokens] = useState<any>(null);

    // const tokenBalance = useCallback((token: any) => {
    //     if(safeTokens && safeTokens.length > 0) {
    //         let selToken = _find(safeTokens, t => _get(t, 'tokenAddress', null) === token)
	// 		if (safeTokens.length > 0 && !selToken)
	// 		    selToken = safeTokens[0];
    //         return _get(selToken, 'balance', 0) / 10 ** _get(selToken, 'token.decimals', 18)
    //     }
    //     return 0
    // }, [safeTokens])

    const getTokens = async (chain: SupportedChainId, safeAddress: String) => {
        return axios.get(`${GNOSIS_SAFE_BASE_URLS[chain]}/api/v1/safes/${safeAddress}/balances/usd/`, {withCredentials: false })
            .then((res: any) => {
                let tokens = res.data.map((t: any) => {
                    let tkn = t
                    if(!tkn.tokenAddress){
                        return {
                            ...t,
                            tokenAddress: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS,
                            token: {
                                symbol: CHAIN_INFO[chain].nativeCurrency.symbol,
                                decimal:  CHAIN_INFO[chain].nativeCurrency.decimals,
                                decimals:  CHAIN_INFO[chain].nativeCurrency.decimals,
                            }
                        }
                    }
                    return t 
                })
                if(tokens && tokens.length > 0) {
                    let total = tokens.reduce((a:any, b:any) => {
                        return a + parseFloat(_get(b, 'fiatBalance', 0))
                    }, 0);
                    axiosHttp.post(`/safe/${DAO?.safe?.address}/sync`, { tokens, balance: total })
                }
                return {[`${safeAddress}`] : tokens}
            })
    }

    useEffect(() => {
        if(DAO?.url) {
            Promise.all(DAO?.safes?.map((s:any) => getTokens(s.chainId, s.address)))
            .then(res => {
                let tokens: any = {}
                for (let index = 0; index < res.length; index++) {
                    const element = res[index];
                    tokens[`${Object.keys(element)[0]}`] = element[`${Object.keys(element)[0]}`]
                }
                setSafeTokens(tokens)
            })
            .catch(e => console.log(e))
        }
    }, [DAO?.url])

    const contextProvider = {
        safeTokens
    };
    return <SafeTokensContext.Provider value={contextProvider}>{children}</SafeTokensContext.Provider>;
}