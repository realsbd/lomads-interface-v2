import axiosHttp from 'api';
import { get as _get, map as _map, filter as _filter, find as _find, orderBy as _orderBy } from 'lodash'
import { getQueryString } from 'utils'

export const loadOffChainTxn = (daoId: string) => {
    return axiosHttp.get(`transaction/off-chain?daoId=${daoId}`)
    .then(txn => txn.data)
    .then(txn => {
        return { pTxn: txn.map((pt: any) => { return { safeAddress: pt?.safe, rawTx: pt } }) }
    })
}

export const loadTreasuryService = (payload: any) => {
    return axiosHttp.get(`/gnosis-safe${getQueryString(payload)}`)
    .then(ptx => _get(ptx, 'data', []))
    .then(ptx =>
        _map(ptx, (p: any) => {
            let matchTx = _find(ptx, px => px.safeAddress === p.safeAddress && (px.rawTx.nonce === p.rawTx.nonce && px.rawTx.isExecuted));
            console.log("matchTx", matchTx, p)
            if (matchTx) {
                if(matchTx?.rawTx?.isExecuted)
                    return { ...p, rawTx : matchTx?.rawTx }
            }
            return p
        })
    )
    .then(ptx =>
        _map(ptx, (p: any) => {
            let matchRejTx = _find(ptx, px => px.safeAddress === p.safeAddress && (px.rawTx.nonce === p.rawTx.nonce && px.rawTx.data === null && px.rawTx.value === "0"));
            if (matchRejTx) {
                if(matchRejTx?.rawTx?.isExecuted) {
                    return { ...p, rawTx : matchRejTx?.rawTx }
                }
                return { ...p, rawTx : { ...p.rawTx, rejectedTxn: matchRejTx?.rawTx }  }
            }
            return p
        })
    )
    .then(ptx => _filter(ptx, p => {
        let matchRejTx = _find(ptx, px => px.safeAddress === p.safeAddress && (px.rawTx.nonce === p.rawTx.nonce && px.rawTx.data === null && px.rawTx.value === "0"));
        if (matchRejTx)
            return matchRejTx.rawTx.safeTxHash !== p.rawTx.safeTxHash
        return true
    }))
    .then(ptx => _filter(ptx, p => !p.rawTx.dataDecoded || (_get(p, 'rawTx.dataDecoded.method', '') === 'multiSend' || _get(p, 'rawTx.dataDecoded.method', '') === 'transfer' || _get(p, 'rawTx.dataDecoded.method', '') === 'addOwnerWithThreshold' || _get(p, 'rawTx.dataDecoded.method', '') === 'removeOwner' || _get(p, 'rawTx.dataDecoded.method', '') === 'changeThreshold')))
    // .then(async ptx => {
    //     let { pTxn } = await loadOffChainTxn(payload?.daoId)
    //     //@ts-ignore
    //     return ptx.concat(pTxn)
    // })
    .then(ptx => _orderBy(ptx, [p => p?.rawTx?.isExecuted, p => p?.rawTx?.executionDate, p => p?.rawTx?.nonce], ['asc', 'desc','asc']))
    .then(ptx => { return { data: ptx } })
}