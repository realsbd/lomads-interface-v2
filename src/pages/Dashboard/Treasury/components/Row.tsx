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
        if(DAO)
            return _find(DAO?.safes, s => s.address === transaction?.safeAddress)?.chainId
        return undefined
    }, [DAO])

    const { transformTx } = useGnosisTxnTransform(transaction?.safeAddress, safeChainId);

    const txn = useMemo(() => {
        if(safeChainId)
            return transformTx(transaction?.rawTx, [])
        return null
    }, [transaction, safeChainId])


    if(!txn || !safeChainId) return null

    console.log("txn", txn, transaction)

    if(transaction?.rawTx?.rejectedTxn) {
        console.log("rejTxn", transaction)
    }

    return (
        <>
            {
                txn.map((tx: any, _i: number) => (
                    <TableRow>
                        <CreditDebit credit={tx?.isCredit} executed={tx?.executionDate} amount={tx?.formattedValue} token={tx?.symbol}/>
                        <Label index={_i}/>
                        <Recipient safeAddress={transaction?.safeAddress} credit={tx?.isCredit} recipient={tx?.to} />
                        <Tag/>
                        <Sign transaction={tx} index={_i} />
                        <Action transaction={tx} txnCount={txn.length} index={_i} />
                    </TableRow>
                ))
            }
        </>
    )
}