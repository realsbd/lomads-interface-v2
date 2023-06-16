import React, { useEffect, useState } from "react"
import { get as _get, find as _find } from 'lodash'
import { makeStyles } from '@mui/styles';
import { Drawer, Box, Typography, Select, FormControl, InputLabel, MenuItem, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Divider } from "@mui/material"
import DoubleEuroSvg from 'assets/svg/doubleEuro.svg'
import Button from "components/Button";
import theme from "theme";
import TextInput from "components/TextInput";
import CloseSVG from 'assets/svg/close-btn.svg'
import { useDAO } from "context/dao";
import { useSafeTokens } from "context/safeTokens";
import { toast } from "react-hot-toast";
import { beautifyHexToken } from "utils";
import IconButton from "components/IconButton";
import Avatar from "components/Avatar";
import Checkbox from "components/Checkbox";
import AmountInput from "components/AmountInput";
import CreatableSelectTag from "components/CreatableSelectTag";
import CloseIcon from '@mui/icons-material/Close';
import useSafe from "hooks/useSafe";
import SwitchChain from "components/SwitchChain";
import useGnosisSafeTransaction from "hooks/useGnosisSafeTransaction";
import { useWeb3Auth } from "context/web3Auth";
import useOffChainTransaction from "hooks/useOffChainTransaction";

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '575px', 
        position: 'relative', 
        flex: 1, 
        padding: '32px 72px 32px 72px', 
        borderRadius: '20px 0px 0px 20px'
    },
    footer: {
        width: 575,
        height: 80,
        background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', 
        position: 'fixed', 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        borderRadius: '0px 0px 0px 20px', 
        padding: '0px 72px 0px 72px',
    },
    currencyBody: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boldText: {
        color: '#c94b32',
        fontFamily: 'Inter,sans-serif',
        fontSize: '40px !important',
        fontStyle: 'normal',
        fontWeight: '400 !important',
        lineHeight: '33px !important',
        textAlign: 'center',
        margin: '24px 0 !important'
    }
  }));

export default ({ open, onClose }: any) => {
    const classes = useStyles()
    const { account, chainId: currentChainId } = useWeb3Auth()
    const { DAO } = useDAO()
    const { safeTokens, getToken } = useSafeTokens()
    const { loadSafe } = useSafe()
    const { createSafeTransaction } = useGnosisSafeTransaction();
    const { createSafeTransaction: createOffChainSafeTransaction } = useOffChainTransaction();
    const [sendTokensLoading, setSendTokensLoading] = useState(false)
    const [state, setState] = useState<any>({
        members: []
    })
    const [tab, setTab] = useState(1)

    useEffect(() => {
        if(DAO && DAO?.url){
            setTab(1)
            setState((prev:any) => { return { ...prev, 
                safeAddress: _get(DAO, 'safes[0].address', null),
                token: _get(safeTokens, `${_get(DAO, 'safes[0].address', null)}[0].tokenAddress`, process.env.REACT_APP_NATIVE_TOKEN_ADDRESS),
                members: DAO?.members?.map((member:any) => { return { name: member?.member?.name, address: member?.member?.wallet, selected: false } })
            } })
        }
    }, [DAO?.url, open])

    const toggleMember = (member: any) => {
        setState((prev: any) => { return { ...prev, members: prev.members.map((mem:any) => { 
            if(member.address === mem.address)
                return { ...mem, selected: !mem.selected } 
            return mem
        }) } })
    }

    const handleSendTokens = async () => {
        const safe = loadSafe(state?.safeAddress)
        console.log("safe", safe)
        if((+safe?.chainId !== +currentChainId) && state?.token !== "SWEAT")
            return toast.custom(t => <SwitchChain t={t} nextChainId={+safe?.chainId}/>)
        const send = state?.members?.filter((member:any) => member?.selected).map((member:any) => { return { recipient: member?.address, amount: member?.amount, label: member?.label, tag: member?.tag } })
        try {
            setSendTokensLoading(true)
            const method = state?.token === "SWEAT" ? createOffChainSafeTransaction : createSafeTransaction
            const txn = await method({
                chainId: safe?.chainId,
                safeAddress: state?.safeAddress,
                tokenAddress: state?.token,
                send,
                daoId: _get(DAO, '_id', null),
                isSafeOwner: _find(safe.owners, (owner:any) => owner?.wallet === account) !== null
            })
            onClose()
            return setSendTokensLoading(false)
        } catch (e) {
            setSendTokensLoading(false)
            console.log(e)
            return;
        }
    }

    const RenderTransactionBody = () => {
        return (
            <Box className={classes.currencyBody}>
                <img src={DoubleEuroSvg} />
                <Typography className={classes.boldText}>Transaction Details</Typography>
                <Box
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '350px' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextInput
                        id="outlined-select-currency"
                        select
                        fullWidth
                        label="Treasury"
                        value={state?.safeAddress}
                        onChange={(e:any) =>  setState((prev:any) => { return { ...prev, safeAddress: e.target.value } })}
                    >
                        {
                            DAO?.safes?.map((safe:any) => {
                                return (
                                    <MenuItem key={safe?.address} value={safe?.address}>{ (safe?.name || "Multi-sig wallet") +" ("+ beautifyHexToken(safe?.address) +")" }</MenuItem>
                                )
                            })
                        }
                    </TextInput>
                </Box>
                <Box
                    component="form"
                    sx={{
                    '& .MuiTextField-root': { m: 1, width: '350px' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextInput
                        id="outlined-select-currency"
                        select
                        fullWidth
                        disabled={!state?.safeAddress}
                        label="Token"
                        value={state?.token}
                        onChange={(e:any) =>  setState((prev:any) => { return { ...prev, token: e.target.value } })}
                    >
                        {
                            _get(safeTokens, state?.safeAddress, [])?.map((token:any) => {
                                return (
                                    <MenuItem key={token?.tokenAddress} value={token?.tokenAddress}>{ token?.token?.symbol }</MenuItem>
                                )
                            })
                        }
                    </TextInput>
                </Box>
            </Box> 
        )
    }
    

    const RenderRecipientBody = () => {
        return (
            <Box style={{ paddingTop: 80, paddingBottom: 80 }}>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Typography style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, color: "#76808d", fontSize: 14 }}>Select Recipients</Typography>
                    <Button size="small" color="secondary" variant="contained">Add new recipient</Button>
                </Box>
                <List dense sx={{ mt: 2 }}>
                    {
                        state?.members?.map((member:any) => {
                            const labelId = `checkbox-list-label-${member.wallet}`;
                            return (
                                <ListItem
                                disablePadding key={member.wallet}>
                                    <ListItemButton onClick={() => toggleMember(member)}  role={undefined} dense>
                                        <Avatar name={_get(member, 'name', '')} wallet={_get(member, 'address', '')} />
                                        <Checkbox
                                            edge="end"
                                            tabIndex={-1}
                                            checked={member.selected}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Box>
        )
    }

    const RenderSendTokenBody = () => {
        return (
            <Box style={{ paddingTop: 42, paddingBottom: 80 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={DoubleEuroSvg} />
                    <Typography className={classes.boldText}>Transaction Details</Typography>
                    <Box
                        component="form"
                        sx={{
                        '& .MuiTextField-root': { m: 1, width: '350px' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextInput
                            id="outlined-select-currency"
                            select
                            fullWidth
                            label="Treasury"
                            value={state?.safeAddress}
                            onChange={(e:any) =>  setState((prev:any) => { return { ...prev, safeAddress: e.target.value } })}
                        >
                            {
                                DAO?.safes?.map((safe:any) => {
                                    return (
                                        <MenuItem key={safe?.address} value={safe?.address}>{ (safe?.name || "Multi-sig wallet") +" ("+ beautifyHexToken(safe?.address) +")" }</MenuItem>
                                    )
                                })
                            }
                        </TextInput>
                    </Box>
                    <Box
                        component="form"
                        sx={{
                        '& .MuiTextField-root': { m: 1, width: '350px' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextInput
                            id="outlined-select-currency"
                            select
                            fullWidth
                            disabled={!state?.safeAddress}
                            label="Token"
                            value={state?.token}
                            onChange={(e:any) =>  setState((prev:any) => { return { ...prev, token: e.target.value } })}
                        >
                            {
                                _get(safeTokens, state?.safeAddress, [])?.map((token:any) => {
                                    return (
                                        <MenuItem key={token?.tokenAddress} value={token?.tokenAddress}>{ token?.token?.symbol }</MenuItem>
                                    )
                                })
                            }
                        </TextInput>
                    </Box>
                    <Box sx={{ my:3 }} style={{ alignSelf: 'center', backgroundColor: '#c94b32', border: '2px solid #c94b32', borderRadius: '50px', height: 0, width: '210px' }} ></Box>
                    <Box style={{ width: '100%' }}>
                        {
                            state?.members?.filter((member: any) => member.selected).map((member: any) => {
                                return (
                                    <Box sx={{ py: 2 }} style={{ width: '100%', borderBottom: '1px solid #f5f5f5' }} display="flex" flexDirection="column">
                                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                                            <Avatar name={member?.name} wallet={member?.address} />
                                            <IconButton onClick={() => toggleMember(member)} style={{ width: '20px !important', height: '20px !important' }} size="small">
                                                <CloseIcon style={{ fontSize: 14, color: '#c94b32' }} />
                                            </IconButton>
                                        </Box>
                                        <Box sx={{ mt: 1.5 }} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                                            <AmountInput onChange={(e:any) => { 
                                                setState((prev: any) => { return { ...prev, members: prev.members.map((mem:any) => { 
                                                    if(member.address === mem.address)
                                                        return { ...mem, amount: e } 
                                                    return mem
                                                }) } })
                                             }} value={member?.amount} />
                                             <TextInput onChange={(e:any) => {
                                                setState((prev: any) => { return { ...prev, members: prev.members.map((mem:any) => { 
                                                    if(member.address === mem.address)
                                                        return { ...mem, label: e.target.value } 
                                                    return mem
                                                }) } })
                                             }} sx={{ mx: 1 }} placeholder="Reason for transaction" size="small"/>
                                             <Box style={{ width: 150 }}>
                                                <CreatableSelectTag onChangeOption={(e:any) => {
                                                    setState((prev: any) => { return { ...prev, members: prev.members.map((mem:any) => { 
                                                        if(member.address === mem.address)
                                                            return { ...mem, tag: e } 
                                                        return mem
                                                    }) } })
                                                }}/>
                                             </Box>
                                        </Box>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Button onClick={() => setTab(2)} size="small" color="secondary" variant="contained">Add a member</Button>
                    </Box>
                    <Box sx={{ my:3 }} style={{ alignSelf: 'center', backgroundColor: '#c94b32', border: '2px solid #c94b32', borderRadius: '50px', height: 0, width: '210px' }} ></Box>
                </Box>
            </Box> 
        )
    }

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: theme.zIndex.drawer + 2 }}
            anchor={'right'}
            open={open}
            onClose={() => onClose()}>
            <Box className={classes.root}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={onClose}>
                    <img src={CloseSVG} />
                </IconButton>
                { tab === 1 ? RenderTransactionBody() :
                  tab === 2 ? RenderRecipientBody() :
                  tab === 3 ? RenderSendTokenBody() :
                  null
                }
            </Box>
            <Box className={classes.footer}>
                {
                    tab === 1 ?
                    <Button onClick={() => setTab(2)} disabled={!state?.safeAddress || !state?.token} color="primary" variant="contained" size="small">Next</Button> :
                    tab === 2 ?
                    <Box width={"100%"} display="flex" flexDirection="row" alignItems="center">
                        <Button sx={{ mx: 1 }} onClick={() => setTab(1)} fullWidth color="primary" variant="outlined" size="small">Cancel</Button>
                        <Button sx={{ mx: 1 }} onClick={() => setTab(3)} disabled={state?.members?.filter((m:any) => m.selected).length == 0} fullWidth color="primary" variant="contained" size="small">Next</Button>
                    </Box> :
                    tab === 3 ?
                    <Button loading={sendTokensLoading} disabled={sendTokensLoading} onClick={() => handleSendTokens()} color="primary" variant="contained" size="small">Send Tokens</Button> :
                    null
                }
            </Box>
        </Drawer>
    )
}