import React, { useCallback, useEffect, useMemo, useState } from "react"
import { find as _find, orderBy as _orderBy, get as _get } from 'lodash'
import { IconButton as MuiIconButton } from "@mui/material";
import clsx from "clsx";
import { Grid, Box, Typography, Tabs, Tab, Divider, Skeleton, TableContainer, Table, TableBody, Stack } from "@mui/material"
import { makeStyles } from '@mui/styles';
import { useDAO } from "context/dao";
import { useParams } from "react-router-dom";
import { useAppSelector } from "helpers/useAppSelector";
import { useAppDispatch } from "helpers/useAppDispatch";
import { loadTreasuryAction, syncSafeAction } from "store/actions/treasury";
import SyncIcon from '@mui/icons-material/Sync';
import Row from "./components/Row";
import { useSafeTokens } from "context/safeTokens";
import { values } from "lodash";
import { usePrevious } from "hooks/usePrevious";
import Button from "components/Button";
import palette from "theme/palette";
import SendToken from "../SendToken";
import IconButton from "components/IconButton";
import AddIcon from '@mui/icons-material/Add';
import RecurringPayment from "./RecurringPayment";

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
    const { DAO } = useDAO();
    const { daoURL } = useParams()
    const { safeTokens } = useSafeTokens()
    const [showSendToken, setShowSendToken] = useState(false);
    const [showRecurringPayment, setShowRecurringPayment] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    //@ts-ignore
    const { treasury } = useAppSelector(store => store.treasury)

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
                        {/* <Tab label="Recurring payments" {...a11yProps(1)} /> */}
                    </Tabs>
                    <Box>
                        { activeTab == 0 && <Button onClick={() => setShowSendToken(true)} sx={{ color: palette?.primary?.main }} size="small" variant="contained" color="secondary">SEND TOKEN</Button> }
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
                        <Button onClick={() => setShowRecurringPayment(true)} color="secondary" variant="contained" startIcon={<AddIcon color="primary" />} size="small" ><Typography color="primary">NEW RECURRING PAYMENT</Typography></Button>
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
            <SendToken open={showSendToken} onClose={() => setShowSendToken(false)} />
            <RecurringPayment open={showRecurringPayment} onClose={() => setShowRecurringPayment(false)} />
        </Grid>
    )
}