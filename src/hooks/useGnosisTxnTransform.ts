import React, { useCallback, useMemo } from 'react';
import { get as _get, find as _find, pick as _pick } from 'lodash'
import { ethers } from 'ethers';
import { CHAIN_INFO } from 'constants/chainInfo';
import moment from 'moment';
import { useSafeTokens } from 'context/safeTokens';
import { useWeb3Auth } from 'context/web3Auth';
import { useDAO } from 'context/dao';
import useSafe from './useSafe';

export default (safeAddress: string | undefined) => {
    const { account } = useWeb3Auth()
    const { loadSafe } = useSafe()
    const { safeTokens } = useSafeTokens()

    const getERC20Token = useCallback((tokenAddr: string) => {
        if(safeTokens && safeAddress) {
            console.log("getERC20Token", safeTokens, safeAddress, _get(safeTokens, safeAddress, []))
            return _find(_get(safeTokens, safeAddress, []),  st => _get(st, 'tokenAddress', '0x') === tokenAddr)
        }
        return null
    }, [safeTokens, safeAddress])

    const safe = useMemo(() => {
        if(safeAddress)
            return loadSafe(safeAddress)
        return null
    }, [safeAddress])

    const getNativeToken = useCallback(() => {
        if(safe?.chainId)
            return { ...CHAIN_INFO[safe?.chainId]?.nativeCurrency, tokenAddress: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS }
        return { name: '', symbol: '', decimals: 18, tokenAddress: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS }
    }, [safe?.chainId, safeAddress])

    const isNativeTokenSingleTransfer = (transaction: any) => {
        if(transaction?.value !== "0" && transaction?.dataDecoded === null) 
            return true
        return false
    }

    const isTokenMultiTransfer = (transaction: any) => {
        if(transaction?.value === "0" && _get(transaction, 'dataDecoded.method', '') === 'multiSend') 
            return true
        return false
    }

    const isERC20TokenSingleTransfer = (transaction: any) => {
        if(transaction?.value === "0" && _get(transaction, 'dataDecoded.method', '') === 'transfer') 
            return true
        return false
    }

    const isOperationTransaction = (transaction: any) => {
        if(transaction?.value === "0" && 
            (_get(transaction, 'dataDecoded.method', '') === 'addOwnerWithThreshold') ||
            (_get(transaction, 'dataDecoded.method', '') === 'changeThreshold') ||
            (_get(transaction, 'dataDecoded.method', '') === 'removeOwner')
        ) 
            return true
        return false
    }

    const transformNativeTokenSingleTransfer = (transaction: any) => {
        const nativeToken = getNativeToken();
        if(!nativeToken)
            return [];
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c.owner === account)
        const hasMyRejection = transaction?.rejectedTxn && _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = transaction?.rejectedTxn && _get(transaction, 'rejectedTxn.confirmationsRequired', _get(safe, 'threshold', 0)) === _get(transaction, 'rejectedTxn.confirmations', [])?.length
        return [{
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
            safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
            rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
            offChain: false,
            nonce: _get(transaction, 'nonce', "0"),
            value: _get(transaction, 'value', 0),
            formattedValue: (+_get(transaction, 'value', 0) / ( 10 ** nativeToken?.decimals )),
            symbol: nativeToken?.symbol,
            tokenAddress: nativeToken?.tokenAddress || transaction?.token?.tokenAddress,
            decimals: nativeToken?.decimals,
            to: _get(transaction, 'to', "0x"),
            confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: false
        }]
    }

    const transformMultiOpeartion = (transaction: any, labels: any) => {
        const nativeToken = getNativeToken();
        if(!nativeToken)
            return [];
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = transaction?.rejectedTxn && _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = transaction?.rejectedTxn && _get(transaction, 'rejectedTxn.confirmationsRequired', _get(safe, 'threshold', 0)) === (_get(transaction, 'rejectedTxn.confirmations', [])?.length | 0)
        let op = [];
        if(_get(transaction, 'dataDecoded.parameters[0].valueDecoded')) {
            for (let index = 0; index < _get(transaction, 'dataDecoded.parameters')?.length; index++) {
                const parameters = _get(transaction, 'dataDecoded.parameters')[index];
                const setAllowanceTxn = _find(parameters?.valueDecoded, vd => vd?.dataDecoded?.method === 'setAllowance');
                if(!setAllowanceTxn) {
                    if(parameters.valueDecoded) {
                        for (let index = 0; index < parameters.valueDecoded.length; index++) {
                            const decoded = parameters.valueDecoded[index];
                            if(!decoded.dataDecoded) {
                                op.push({
                                    txHash: _get(transaction, 'txHash', ''),
                                    transactionHash: _get(transaction, 'transactionHash', ''),
                                    safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                                    rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                                    offChain: transaction?.offChain || transaction?.safeTxHash?.indexOf('0x') === -1,
                                    nonce: _get(transaction, 'nonce', "0"),
                                    value: _get(decoded, 'value', 0),
                                    formattedValue: (+_get(decoded, 'value', 0) / ( 10 ** nativeToken?.decimals )),
                                    symbol: nativeToken?.symbol,
                                    tokenAddress: nativeToken?.tokenAddress || transaction?.token?.tokenAddress,
                                    decimals: nativeToken?.decimals,
                                    to: _get(decoded, 'to', "0x"),
                                    confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
                                    confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                                    hasMyConfirmation: hasMyConfirmation ? true: false,
                                    hasRejection: transaction?.rejectedTxn ? true : false,
                                    hasMyRejection: hasMyRejection ? true : false,
                                    rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                                    canExecuteTxn,
                                    canRejectTxn,
                                    executor: _get(transaction, 'executor', '0x'),
                                    submissionDate: _get(transaction, 'submissionDate', null),
                                    executionDate: _get(transaction, 'executionDate', null),
                                    isCredit: false
                                })
                            } else if (decoded.dataDecoded) {
                                const erc20Token: any = getERC20Token(_get(decoded, 'to', '0x'));
                                const parameters = _get(decoded, 'dataDecoded.parameters');
                                const to = _get(_find(parameters, p => p.name === 'to'), 'value', '0x')
                                const value = _get(_find(parameters, p => p.name === 'value'), 'value', 0)
                        
                                op.push({
                                    txHash: _get(transaction, 'txHash', ''),
                                    transactionHash: _get(transaction, 'transactionHash', ''),
                                    safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                                    rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                                    offChain: transaction?.offChain || transaction?.safeTxHash?.indexOf('0x') === -1,
                                    nonce: _get(transaction, 'nonce', "0"),
                                    value: value,
                                    formattedValue: (+value / ( 10 ** (erc20Token?.token?.decimals || erc20Token?.token?.decimal || 18) )),
                                    symbol: erc20Token?.token?.symbol || transaction?.token?.symbol,
                                    tokenAddress: erc20Token?.tokenAddress || transaction?.token?.tokenAddress,
                                    decimals: erc20Token?.token?.decimal || erc20Token?.token?.decimals || 18,
                                    to: to,
                                    confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
                                    confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                                    hasMyConfirmation: hasMyConfirmation ? true: false,
                                    hasRejection: transaction?.rejectedTxn ? true : false,
                                    hasMyRejection: hasMyRejection ? true : false,
                                    rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                                    canExecuteTxn,
                                    canRejectTxn,
                                    executor: _get(transaction, 'executor', '0x'),
                                    submissionDate: _get(transaction, 'submissionDate', null),
                                    executionDate: _get(transaction, 'executionDate', null),
                                    isCredit: false
                                })
                            }
                        }
                    }
                } else {
                    let value = _get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'allowanceAmount'), 'value', '0')
                    const allowanceToken: any = getERC20Token(_get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'token'), 'value', ''))
                    const to = _get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'delegate'), 'value', 0)
                    let am = _get(_find(labels, (l:any) => l?.recipient?.toLowerCase() === to?.toLowerCase() && l.safeTxHash === transaction?.safeTxHash), "recurringPaymentAmount", null)
                    if(am)
                        value = (+am * ( 10 ** (allowanceToken?.token?.decimal || allowanceToken?.token?.decimals) ));
                    op.push({
                        txHash: _get(transaction, 'txHash', ''),
                        transactionHash: _get(transaction, 'transactionHash', ''),
                        safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                        rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                        offChain: transaction?.offChain || transaction?.safeTxHash?.indexOf('0x') === -1,
                        nonce: _get(transaction, 'nonce', "0"),
                        value: value,
                        formattedValue: (+value / ( 10 ** (allowanceToken?.token?.decimal || allowanceToken?.token?.decimals) )),
                        symbol: allowanceToken?.token?.symbol,
                        tokenAddress: allowanceToken?.tokenAddress || transaction?.token?.tokenAddress,
                        decimals: (allowanceToken?.token?.decimal || allowanceToken?.token?.decimals),
                        to: to,
                        confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
                        confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                        hasMyConfirmation: hasMyConfirmation ? true: false,
                        hasRejection: transaction?.rejectedTxn ? true : false,
                        hasMyRejection: hasMyRejection ? true : false,
                        rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                        canExecuteTxn,
                        canRejectTxn,
                        executor: _get(transaction, 'executor', '0x'),
                        submissionDate: _get(transaction, 'submissionDate', null),
                        executionDate: _get(transaction, 'executionDate', null),
                        isCredit: false
                    }) 
                }
            }
        } else {
            const to = _get(_find(_get(transaction, 'dataDecoded.parameters'), p => p.name === 'to'), 'value', '0x')
            const value = _get(_find(_get(transaction, 'dataDecoded.parameters'), p => p.name === 'value'), 'value', 0)
      
            return [{
                txHash: _get(transaction, 'txHash', ''),
                transactionHash: _get(transaction, 'transactionHash', ''),
                safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                offChain: transaction?.offChain || transaction?.safeTxHash?.indexOf('0x') === -1,
                nonce: _get(transaction, 'nonce', "0"),
                value: value,
                formattedValue: value === '0x' ? '0x' : (+value / ( 10 ** (transaction?.token?.decimals || transaction?.token?.decimal || 18) )),
                symbol: transaction?.token?.symbol,
                decimals: transaction?.token?.decimals || transaction?.token?.decimal || 18,
                tokenAddress: transaction?.token?.tokenAddress,
                to: to,
                confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
                confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                hasMyConfirmation: hasMyConfirmation ? true: false,
                hasRejection: transaction?.rejectedTxn ? true : false,
                hasMyRejection: hasMyRejection ? true : false,
                rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                canExecuteTxn,
                canRejectTxn,
                executor: _get(transaction, 'executor', '0x'),
                submissionDate: _get(transaction, 'submissionDate', null),
                executionDate: _get(transaction, 'executionDate', null) ? moment.utc(_get(transaction, 'executionDate', null)).format() : '',
                isCredit: false
            }]
        }
        return op
    }

    const transferERC20TokenSingleTransfer = (transaction: any) => {
        const erc20Token: any = getERC20Token(_get(transaction, 'to', '0x'));
        console.log("erc20Token", erc20Token)
        if(!erc20Token)
            return [];
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = transaction?.rejectedTxn && _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = transaction?.rejectedTxn && _get(transaction, 'rejectedTxn.confirmationsRequired', _get(safe, 'threshold', 0)) === (_get(transaction, 'rejectedTxn.confirmations', [])?.length || 0)
        const parameters = _get(transaction, 'dataDecoded.parameters');
        const to = _get(_find(parameters, p => p.name === 'to'), 'value', '0x')
        const value = _get(_find(parameters, p => p.name === 'value'), 'value', 0)
        let op = [];
        op.push({
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
            safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
            rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
            offChain: transaction?.offChain || transaction?.safeTxHash?.indexOf('0x') === -1,
            nonce: _get(transaction, 'nonce', "0"),
            value: value,
            formattedValue: (+value / ( 10 ** ( erc20Token?.token?.decimals || erc20Token?.token?.decimal || 18 ) )),
            symbol: erc20Token?.token?.symbol || transaction?.token?.symbol,
            decimals: erc20Token?.token?.decimal || erc20Token?.token?.decimals,
            tokenAddress: erc20Token?.tokenAddress || transaction?.token?.tokenAddress,
            to: to,
            confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: (_get(transaction, 'rejectedTxn.confirmations', [])?.length || 0),
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: false
        })
        return op
    }

    const transformOperationTxn = (transaction: any) => {
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = transaction?.rejectedTxn && _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = transaction?.rejectedTxn && _get(transaction, 'rejectedTxn.confirmationsRequired', _get(safe, 'threshold', 0)) === (_get(transaction, 'rejectedTxn.confirmations', [])?.length || 0)
        let op = [];
        op.push({
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
            safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
            rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
            offChain: transaction?.offChain || transaction?.safeTxHash?.indexOf('0x') === -1,
            nonce: _get(transaction, 'nonce', "0"),
            value: 0,
            formattedValue: "0",
            symbol: "",
            decimals: "",
            tokenAddress: "0x",
            to: "0x",
            confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: false
        })
        return op
    }

    const transformEthTxn = (transaction: any) => {
        const erc20Token: any = getERC20Token(_get(transaction, 'transfers[0].tokenAddress', '0x'));
        if(!erc20Token)
            return [];
        const value = _get(transaction, 'transfers[0].value', '0')
        return [{
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
            safeTxHash: _get(transaction, 'txHash', "0"),
            rejectionSafeTxHash: null,
            nonce: _get(transaction, 'nonce', 0),
            offChain: transaction?.offChain || transaction?.safeTxHash?.indexOf('0x') === -1,
            value: value,
            formattedValue: (+value / ( 10 ** (erc20Token?.token?.decimals || erc20Token?.token?.decimal) )),
            symbol: _get(transaction, 'transfers[0].tokenInfo.symbol', null),
            decimals: _get(transaction, 'transfers[0].tokenInfo.decimals', null),
            tokenAddress: erc20Token?.tokenAddress || transaction?.token?.tokenAddress,
            to: _get(transaction, 'to', "0x"),
            confimationsRequired: _get(transaction, 'confirmationsRequired', _get(safe, 'threshold', 0)),
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: false,
            hasRejection: false,
            hasMyRejection: false,
            rejections: 0,
            canExecuteTxn: false,
            canRejectTxn: false,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: true
        }]
    }

    const transformTx = (transaction: any, labels: any) => {
        if (transaction.txType === "ETHEREUM_TRANSACTION") {
            const data = transformEthTxn(transaction)
            return data
        } else {
            if(isNativeTokenSingleTransfer(transaction)) {
                if(transaction._id === "647f7e0dd77026d2ba13b350")
                    console.log("offChain", "transformNativeTokenSingleTransfer")
                const data = transformNativeTokenSingleTransfer(transaction)
                return data
            } else if(isTokenMultiTransfer(transaction)) {
                if(transaction._id === "647f7e0dd77026d2ba13b350")
                    console.log("offChain", "transformMultiOpeartion", transaction)
                const data = transformMultiOpeartion(transaction, labels)
                return data
            } else if(isERC20TokenSingleTransfer(transaction)) {
                if(transaction._id === "647f7e0dd77026d2ba13b350")
                    console.log("offChain", "transferERC20TokenSingleTransfer")
                const data = transferERC20TokenSingleTransfer(transaction)
                return data
            } else if(isOperationTransaction(transaction)) {
                if(transaction._id === "647f7e0dd77026d2ba13b350")
                    console.log("offChain", "transformOperationTxn")
                const data = transformOperationTxn(transaction)
                return data
            } else {
                if(transaction._id === "647f7e0dd77026d2ba13b350")
                    console.log("offChain", "transformMultiOpeartion", transaction)
                const data = transformMultiOpeartion(transaction, labels)
                return data
            }
        }
    }

    const transform = (transactions: any, labels = [], exportCSV: boolean = false) => {
        let output = []
        for (let index = 0; index < transactions.length; index++) {
            const transaction = transactions[index];
            const data = transformTx(transaction, labels)
            output.push(data)
        }
        if(exportCSV) {
            let exportData = []
            for (let index = 0; index < output.length; index++) {
                const arr: any = output[index];
                for (let j = 0; j < arr.length; j++) {
                    let element = arr[j];
                    if(element.value !== 0 && !element.offChain) {
                        element = { 
                            transaction_hash: _get(element, 'transactionHash', '') === '' ? _get(element, 'txHash', '') : _get(element, 'transactionHash', ''),
                            incoming_amount: element.isCredit ? _get(element, 'formattedValue', '') : '',
                            incoming_token:  element.isCredit ? _get(element, 'symbol', '')  : '',
                            outgoing_amount: !element.isCredit ? _get(element, 'formattedValue', '') : '',
                            outgoing_token:  !element.isCredit ? _get(element, 'symbol', '')  : '',
                            description: _get(_find(labels, (l:any) => l?.recipient?.toLowerCase() === element.to.toLowerCase() && l?.safeTxHash === element.safeTxHash), "label", null),
                            recipient_wallet: _get(element, 'to', ''),
                            execution_date: _get(element, 'executionDate', null) ? _get(element, 'executionDate', "") : 'Pending'
                        }
                        exportData.push(element)
                    }
                }
            }
            return exportData
        }
        return output
    }
    return { 
        transformTx,
        transform, 
        transformEthTxn, 
        transformNativeTokenSingleTransfer, 
        transformMultiOpeartion, 
        transferERC20TokenSingleTransfer, 
        transformOperationTxn ,
        isNativeTokenSingleTransfer,
        isTokenMultiTransfer,
        isERC20TokenSingleTransfer,
        isOperationTransaction
    }
}