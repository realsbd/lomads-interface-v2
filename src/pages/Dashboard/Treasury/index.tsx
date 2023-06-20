import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { find as _find, orderBy as _orderBy, get as _get, uniqBy as _uniqBy } from 'lodash'
import { IconButton as MuiIconButton } from "@mui/material";
import clsx from "clsx";
import { Grid, Box, Typography, Tabs, Tab, Divider, Skeleton, TableContainer, Table, TableBody, Stack } from "@mui/material"
import { makeStyles } from '@mui/styles';
import { useDAO } from "context/dao";
import { LeapFrog } from "@uiball/loaders";
import { useParams } from "react-router-dom";
import { useAppSelector } from "helpers/useAppSelector";
import { useAppDispatch } from "helpers/useAppDispatch";
import { loadRecurringPaymentsAction, loadTreasuryAction, syncSafeAction } from "store/actions/treasury";
import SyncIcon from '@mui/icons-material/Sync';
import Row from "./components/Row";
import { useSafeTokens } from "context/safeTokens";
import { values } from "lodash";
import moment from "moment";
import exportBtn from 'assets/svg/exportBtn.png'
import { usePrevious } from "hooks/usePrevious";
import Button from "components/Button";
import palette from "theme/palette";
import CsvDownloadButton from 'react-json-to-csv'
import SendToken from "../SendToken";
import IconButton from "components/IconButton";
import AddIcon from '@mui/icons-material/Add';
import CreateRecurringPayment from "./RecurringPayment/Create";
import RecurringPayment from "./RecurringPayment";
import RecurringRow from './components/RecurringRow'
import { useWeb3Auth } from "context/web3Auth";
//@ts-ignore
import { JsonToCsv, useJsonToCsv } from 'react-json-csv';
import axios from "axios";
import { GNOSIS_SAFE_BASE_URLS } from "constants/chains";
import useGnosisTxnTransform from "hooks/useGnosisTxnTransform";
const { toChecksumAddress } = require('ethereum-checksum-address')

const useStyles = makeStyles((theme: any) => ({
    root: {

    },
    header: {
        height: 72,
        //filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.09))",
        backgroundColor: "#FFF",
        borderRadius: 5,
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        padding: 16
    },
    stack: {
        flex: 1,
        overflow: 'hidden',
        overflowX: 'auto',
        margin: '0 16px 0 0'
    },
    tokenHeader: {
        display: 'flex',
        height: 72,
        width: '100%',
        backgroundColor: `#FFF`,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        padding: "0 20px"
    },
    reccurHeader: {
        display: 'flex',
        height: 72,
        width: '100%',
        backgroundColor: `#FFF`,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderRadius: 5,
        padding: "0 20px"
    },
    table: {
        //filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.09))",
        backgroundColor: "#FFF",
        borderRadius: 5
    },
    tabs: {
        display: "flex",
        flexDirection: 'row',
        flexGrow: 1
    },
    verDivider: {
        opacity: 0.3,
        border: '1px solid #1B2B41',
        margin: '0 16px',
        height: 32
    },
    tab: {
        cursor: 'pointer'
    },
    tabItem: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '400 !important',
        fontSize: '20px !important',
        lineHeight:'27px !important',
        color: '#1B2B41',
        opacity: 0.3
    },
    tabItemActive: {
        opacity: 0.7
    }
  }));

export default () => {
    const classes = useStyles();
    const dispatch = useAppDispatch()
    const downloadRef = useRef<any>()
    const { DAO } = useDAO();
    const { daoURL } = useParams()
    const { account } = useWeb3Auth()
    const { safeTokens } = useSafeTokens()
    const [showSendToken, setShowSendToken] = useState(false);
    const [showRecurringPayment, setShowRecurringPayment] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [activeTransaction, setActiveTransaction] = useState(null);
    const { saveAsCsv } = useJsonToCsv();
    const [csvLoading, setCsvLoading] = useState(false);
    const { transformTx } = useGnosisTxnTransform();
    const [downloadableData, setDownloadableData] = useState([])

    const { treasury, recurringPayments } = useAppSelector((store: any) => store.treasury)

    const handleDownloadCsv = async () => {
        try {
            setCsvLoading(true)
            const fields = {
                "safeAddress": "Safe address",
                "transactionHash": "Transaction hash",
                "incomingAmount": "Incoming amount",
                "incomingToken": "Incoming token",
                "outgoingAmount": "Outgoing amount",
                "outgoingToken": "Outgoing token",
                "description": "Description",
                "recipientWallet": "Recipient Wallet",
                "executionDate": "Execution Date"
            }
            let csvData = []
            let safesList = DAO?.safes;
            const filename = `${moment().unix()}`
            const safes = _uniqBy(safesList, (sl:any) => sl?.address)?.map((safe:any) => {
                return axios.get(`${GNOSIS_SAFE_BASE_URLS[safe?.chainId]}/api/v1/safes/${safe.address}/all-transactions/?limit=1000&offset=0`)
            })
            const safesDump = await Promise.all(safes);
            console.log("DUMP", safesDump)
            for (let index = 0; index < safesDump.length; index++) {
                const safe = safesList[index]
                const dump: any = safesDump[index]?.data?.results;
                console.log("DUMP", dump)
                for (let index = 0; index < dump.length; index++) {
                    const txn: any = dump[index];
                    const metadata = _find(treasury, (tx:any) => tx?.safeAddress === safe?.address && (tx?.rawTx?.safeTxHash === txn?.safeTxHash || tx?.rawTx?.txHash === txn?.txHash))
                    const transformedTxn = transformTx(txn, [], safe?.address)
                    for (let index = 0; index < transformedTxn.length; index++) {
                        const ttxn = transformedTxn[index];
                        if(ttxn?.to !== '0x') {
                            csvData.push({
                                safeAddress: safe?.address,
                                transactionHash: ttxn?.txHash && ttxn?.txHash !== '' ? ttxn?.txHash : ttxn?.transactionHash,
                                incomingAmount: ttxn?.isCredit ? ttxn?.formattedValue : '',
                                incomingToken: ttxn?.isCredit ? ttxn?.symbol: '',
                                outgoingAmount: !ttxn?.isCredit ? ttxn?.formattedValue : '',
                                outgoingToken: !ttxn?.isCredit ? ttxn?.symbol: '',
                                description: metadata ? metadata[ttxn?.to]?.label || '' : '',
                                recipientWallet: ttxn?.to,
                                executionDate: ttxn?.executionDate ? ttxn?.executionDate : 'pending'
                            })
                        }
                    }
                }
            }
            csvData = _orderBy(csvData, (c:any) => c.executionDate, ['desc'])
            setCsvLoading(false)
            saveAsCsv({ data: csvData, fields, filename })
        } catch(e) {
            setCsvLoading(false)
            console.error(e)
        }
    }

    const allTokens = useMemo(() => {
        if(safeTokens) {
            let at: any = []
            let final: any = []
            Object.values(safeTokens).map((st:any) => { at = at.concat(st) })
            for (let index = 0; index < at.length; index++) {
                let token: any = at[index];
                if(token.tokenAddress === 'SWEAT') continue;
                const exists = _find(final, a => (a.tokenAddress === token.tokenAddress && token.token.symbol === a.token.symbol)) 
                if(exists){
                    token = {
                        ...token,
                        balance: +token.balance + (+exists.balance),
                        fiatBalance: +token.fiatBalance + (+exists.fiatBalance),
                    }
                    final = final.map((t: any) => {
                        if(t.tokenAddress === token.tokenAddress && token.token.symbol === t.token.symbol) {
                            return token
                        }
                        return t
                    })
                }
                else {
                    final = [...final, token]
                }
            }
    
            return final
        }
        return []
    }, [safeTokens])

    useEffect(() => {
        if(DAO?.url) {
            const safes = DAO?.safes?.map((safe:any) => safe?.address)
            dispatch(loadRecurringPaymentsAction({ safes }))
        }
    }, [DAO?.url])

    useEffect(() => {
        if(DAO?.url) {
            let safes = DAO?.safes ? DAO?.safes.map((safe: any) => safe.address) : [DAO?.safe?.address]
            dispatch(loadTreasuryAction({ safes, daoId: DAO?._id }))
        }
    }, [DAO?.url])

    const computeExecutableNonce = useCallback((safeAddress: string) => {
        let safeTxn = treasury.filter((txn: any) => txn?.safeAddress === safeAddress && !txn?.rawTx?.offChain)
        const txn = _orderBy(safeTxn, [p => p?.rawTx?.isExecuted,  p => p?.rawTx?.executionDate, p => p?.rawTx?.nonce], ['asc', 'desc','asc'])
        return _get(txn, `[0].rawTx.nonce`, 0)
    }, [treasury])

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const nextQueue = (rtransaction:any) => {
		if(rtransaction && rtransaction.queue) {
			let queue = rtransaction.queue.filter((q:any) => !q.moduleTxnHash);
			queue = _orderBy(queue, q => q.nonce, 'asc')
			if(queue && queue.length > 0) return queue[0]
		}
		return null
	}

    const recurringTreasuryTxns = useMemo(() => {
		if(!recurringPayments) return []
		const rp = recurringPayments.filter((rtx:any) => {
			const nQ = nextQueue(rtx);
			if(rtx.active && nQ && nQ.nonce < moment().utc().endOf('day').unix() && (account === toChecksumAddress(rtx.receiver.wallet))) 
				return true
			return false
		})
		return rp
	}, [recurringPayments])

    const handleSyncSafe = () => 
        dispatch(syncSafeAction({ safes: DAO?.safes?.map((safe:any) => safe?.address) }))
    

    return (
        <Grid container>
            <Grid item sm={12}>
                { (!DAO || !treasury)  ? 
                <Skeleton sx={{ borderRadius: 1 }}  variant="rectangular" height={72} animation="wave" /> :
                <Box className={classes.header}>
                    <Tabs
                        value={activeTab}
                        onChange={(e: any, val: any) => setActiveTab(val)}
                        aria-label="basic tabs example"
                        TabIndicatorProps={{ hidden: true }}
                        sx={{
                            '& button': { color: 'rgba(118, 128, 141,0.5)', marginRight: '10px', textTransform: 'capitalize', fontSize: '22px', fontWeight: '400' },
                            '& button.Mui-selected': { color: 'rgba(118, 128, 141,1)' },
                        }}
                    >
                        <Tab label="Treasury" {...a11yProps(0)} />
                        <Tab label="Recurring payments" {...a11yProps(1)} />
                    </Tabs>
                    <Box>
                        { activeTab == 0 &&
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Button onClick={() => setShowSendToken(true)} sx={{ color: palette?.primary?.main }} size="small" variant="contained" color="secondary">SEND TOKEN</Button> 
                            <IconButton onClick={() => handleDownloadCsv()}>
                                { !csvLoading ? <img src={exportBtn}/> : <LeapFrog size={20} color="#C94B32" /> }
                            </IconButton>
                        </Box>
                        }
                    </Box>
                </Box> }
            </Grid>
            { activeTab == 0 ?
            <Grid mt={0.5} item sm={12}>
                { (!DAO || !treasury)  ? 
                <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={72} animation="wave" /> :
                <Box className={classes.tokenHeader}>
                    <Box>
                        <Typography style={{ color: "#188C7C", fontWeight: "700", fontSize: 14 }}>{ `$${(allTokens.reduce((a: any, b:any) => a + (+b.fiatBalance), 0)).toFixed(3)} Total Balance` }</Typography>
                    </Box>
                    <Box className={classes.stack} flexGrow={1}>
                        <Stack padding={"6px"} height={72} alignItems="center" justifyContent="flex-end" spacing={2} direction="row">
                            {
                                allTokens.map((token: any) => {
                                    return (
                                        <Typography style={{ color: "#76808d", fontWeight: "700", fontSize: 14 }}>{ `${(token.balance / 10 ** (token.token.decimal || token.token.decimals)).toFixed(3)}` }<span style={{ marginLeft: 6, color: "hsla(214,9%,51%,.5)", fontWeight: "700", fontSize: 14 }}>{token.token.symbol}</span></Typography>
                                    )
                                })
                            }
                        </Stack>
                    </Box>
                </Box>
                }
            </Grid> : null }
            { activeTab == 1 ?
            <Grid mt={0.5} item sm={12}>
                <Box className={classes.reccurHeader}>
                    <Box></Box>
                    <Box>
                        <Button onClick={() => { setActiveTransaction(null); setShowRecurringPayment(true) }} color="secondary" variant="contained" startIcon={<AddIcon color="primary" />} size="small" ><Typography color="primary">NEW RECURRING PAYMENT</Typography></Button>
                    </Box>
                </Box>
            </Grid> : null }
            { activeTab == 0 &&
            <Grid mt={0.5} mb={1} item sm={12}>
                { (!DAO || !treasury || !safeTokens)  ? 
                   <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={500} animation="wave" /> :
                    <Box className={classes.table}>
                        <TableContainer  style={{ maxHeight: 500 }} component={Box}>
                            <Table size="small" stickyHeader aria-label="simple table">
                                <TableBody>
                                    {
                                        DAO && recurringPayments && recurringTreasuryTxns && recurringTreasuryTxns.map((txn:any) => {
                                           return <RecurringRow transaction={txn} />
                                        })
                                    }
                                    {
                                        DAO && treasury && treasury.map((txn:any) => {
                                            const executableNonce = computeExecutableNonce(txn?.safeAddress)
                                           return <Row transaction={txn} executableNonce={executableNonce} />
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                }
            </Grid>
            }
            { activeTab == 1 &&
            <Grid mt={0.5} mb={1} item sm={12}>
                <RecurringPayment onRecurringEdit={(txn:any) => { 
                    setActiveTransaction(txn); 
                    setTimeout(() => {
                        setShowRecurringPayment(true) 
                    }, 500)
                }} />
            </Grid>
            }
            <SendToken open={showSendToken} onClose={() => setShowSendToken(false)} />
            <CreateRecurringPayment transaction={activeTransaction} open={showRecurringPayment} onClose={() => { setActiveTransaction(null); setShowRecurringPayment(false) }} />
        </Grid>
    )
}