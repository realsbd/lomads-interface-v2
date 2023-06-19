import React, { useMemo } from "react"
import { find as _find, get as _get } from 'lodash'
import { TableCell, TableRow } from "@mui/material"
import useGnosisTxnTransform from "hooks/useGnosisTxnTransform"
import axiosHttp from 'api'
import CreditDebit from "./CreditDebit"

import { useDAO } from "context/dao"
import Label from "./Label"
import Recipient from "./Recipient"
import Tag from "./Tag"
import Sign from "./Sign"
import Action from "./Action"
import useSafe from "hooks/useSafe"

export default ({ transaction, executableNonce }: any) => {

    const { DAO } = useDAO();
    const { loadSafe } = useSafe()

    const safeChainId = useMemo(() => {
        if (DAO?.url)
            return _find(DAO?.safes, s => s.address === transaction?.safeAddress)?.chainId
        return undefined
    }, [DAO?.url])

    const { transformTx } = useGnosisTxnTransform(transaction?.safeAddress);

    const txn = useMemo(() => {
        return transformTx(transaction?.rawTx, [])
    }, [transaction])

    const handlePostExecution = async () => {
        let actionList: any = [];
        for (let index = 0; index < txn.length; index++) {
            const tx = txn[index];
            const metadata = _get(transaction, `metadata.${tx.to}`)
            if (!tx.to || tx.to === "0x") return;
            let actions: any = {}
            if (metadata?.sweatConversion) {
                // reset sweat for recipient && update user earnings
                actions = {
                    ...actions,
                    "RESET_SWEAT": { user: tx?.to, daoId: DAO?._id, },
                    "UPDATE_EARNING": { user: tx?.to, daoId: DAO?._id, symbol: tx?.symbol, value: +tx?.formattedValue, currency: tx?.tokenAddress || 'SWEAT' }
                }
            } else if (metadata?.taskId) {
                // close task && update payment for user
                actions = {
                    ...actions,
                    "TASK_PAID": { taskId: metadata?.taskId, user: tx?.to },
                    "UPDATE_EARNING": { user: tx?.to, daoId: DAO?._id, symbol: tx?.symbol, value: +tx?.formattedValue, currency: tx?.tokenAddress || 'SWEAT' }
                }
            } else {
                // update user earnings
                actions = {
                    ...actions,
                    "UPDATE_EARNING": { user: tx?.to, daoId: DAO?._id, symbol: tx?.symbol, value: +tx?.formattedValue, currency: tx?.tokenAddress || 'SWEAT' }
                }
            }
            actionList.push(actions)
        }
        if (actionList.length > 0) {
            await axiosHttp.post(`gnosis-safe/${transaction?.rawTx?.safeTxHash}/executed`, actionList)
                .then(res => {
                    console.log(res.data)
                })
        }
    }

    if (transaction?.rawTx?.daoId && transaction?.rawTx?.token?.tokenAddress === 'SWEAT' && transaction?.rawTx?.daoId !== DAO?._id)
        return null

    if (transaction?.daoId && transaction?.rawTx?.token?.tokenAddress === 'SWEAT' && transaction?.daoId !== DAO?._id)
        return null

    if (!txn) return null

    return (
        <>
            {
                txn.map((tx: any, _i: number) => (
                    <TableRow>
                        <CreditDebit credit={tx?.isCredit} executed={tx?.executionDate} amount={tx?.formattedValue} token={tx?.symbol} />
                        <Label transaction={transaction} recipient={tx?.to} />
                        <Recipient safeAddress={transaction?.safeAddress} credit={tx?.isCredit} recipient={tx?.to} token={tx?.symbol} />
                        <Tag transaction={transaction} recipient={tx?.to} />
                        <Sign transaction={tx} index={_i} />
                        <Action txnGroup={txn} amount={tx?.formattedValue} onPostExecution={handlePostExecution} token={tx?.symbol} tokenAddress={tx?.tokenAddress} executableNonce={executableNonce} safeAddress={transaction?.safeAddress} transaction={tx} txnCount={txn.length} chainId={loadSafe(transaction?.safeAddress)?.chainId} index={_i} />
                    </TableRow>
                ))
            }
        </>
    )
}