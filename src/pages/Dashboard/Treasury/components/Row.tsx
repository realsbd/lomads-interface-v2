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

export default ({ transaction }: any) => {

    const { DAO } = useDAO();

    const safeChainId = useMemo(() => {
        if(DAO?.url)
            return _find(DAO?.safes, s => s.address === transaction?.safeAddress)?.chainId
        return undefined
    }, [DAO?.url])

    const { transformTx } = useGnosisTxnTransform(transaction?.safeAddress, safeChainId);

    const txn = useMemo(() => {
        if(safeChainId)
            return transformTx(transaction?.rawTx, [])
        return null
    }, [transaction, safeChainId])

    if(transaction?.metadata)
        console.log("metaaa",transaction)


    if(!txn || !safeChainId) return null

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
                        <Action transaction={tx} txnCount={txn.length} index={_i} />
                    </TableRow>
                ))
            }
        </>
    )
}