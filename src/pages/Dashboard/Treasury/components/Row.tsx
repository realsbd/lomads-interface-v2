import React, { useMemo } from "react"
import { find as _find } from 'lodash'
import { TableCell, TableRow } from "@mui/material"
import useGnosisTxnTransform from "hooks/useGnosisTxnTransform"

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
        if(DAO?.url)
            return _find(DAO?.safes, s => s.address === transaction?.safeAddress)?.chainId
        return undefined
    }, [DAO?.url])

    const { transformTx } = useGnosisTxnTransform(transaction?.safeAddress);

    const txn = useMemo(() => {
        return transformTx(transaction?.rawTx, [])
    }, [transaction])

    if(!txn) return null

    return (
        <>
            {
                txn.map((tx: any, _i: number) => (
                    <TableRow>
                        <CreditDebit credit={tx?.isCredit} executed={tx?.executionDate} amount={tx?.formattedValue} token={tx?.symbol}/>
                        <Label transaction={transaction} recipient={tx?.to}/>
                        <Recipient safeAddress={transaction?.safeAddress} credit={tx?.isCredit} recipient={tx?.to} />
                        <Tag transaction={transaction} recipient={tx?.to} />
                        <Sign transaction={tx} index={_i} />
                        <Action executableNonce={executableNonce} safeAddress={transaction?.safeAddress} transaction={tx} txnCount={txn.length} chainId={loadSafe(transaction?.safeAddress)?.chainId} index={_i} />
                    </TableRow>
                ))
            }
        </>
    )
}