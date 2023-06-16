import React, { useMemo, useState } from "react";
import { get as _get, find as _find } from 'lodash'
import { Drawer, Box, Typography, Select, FormControl, InputLabel, MenuItem, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Divider, TableContainer, TableBody, Table, TableRow, TableCell } from "@mui/material"
import theme from "theme";
import IconButton from "components/IconButton";
import RecurringPaymentSvg from 'assets/svg/recurring_payment_XL.svg'
import CloseSVG from 'assets/svg/close-btn.svg'
import { makeStyles } from "@mui/styles";
import palette from "theme/palette";
import TextInput from "components/TextInput";
import axiosHttp from 'api'
import { useDAO } from "context/dao";
import { useWeb3Auth } from "context/web3Auth";
import Avatar from "components/Avatar";
import CurrencyInput from "components/CurrencyInput";
import { useSafeTokens } from "context/safeTokens";
import { beautifyHexToken } from "utils";
import moment from "moment";
import Checkbox from "components/Checkbox";
import AmountInput from "components/AmountInput";
import Button from "components/Button";
import useGnosisAllowance from "hooks/useGnosisAllowance";
import useSafe from "hooks/useSafe";

const FREQUENCY = [{ label: "Weekly", value: "weekly" }, { label: "Monthly", value: "monthly" }]

const format = (val:any) => (val || '0') + ` occurance`
const parse = (val:any) => (val || '0').replace(/^\occurance/, '')

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '575px', 
        position: 'relative', 
        flex: 1, 
        padding: '32px 72px 80px 72px', 
        borderRadius: '20px 0px 0px 20px'
    },
  }));

export default ({ open, onClose }: any) => {
    const classes = useStyles()
    const { DAO } = useDAO();
    const { account } = useWeb3Auth()
    const { safeTokens, getToken } = useSafeTokens()
    const [state, setState] = useState<any>({
        frequency: 'weekly',
        ends: { value: "NEVER" }
    })
    const { loadSafe } = useSafe()
    const { gnosisAllowanceLoading, setAllowance, getSpendingAllowance, createAllowanceTransaction } = useGnosisAllowance(state?.safeAddress, loadSafe(state?.safeAddress)?.chainId);
    const [errors, setErrors] = useState<any>({})

    const ReceiversList = useMemo(() => {
        return DAO?.members?.filter((member:any) => member?.member?.wallet?.toLowerCase() !== account?.toLowerCase()).map((member:any) => member.member)
    }, [DAO?.url])


    const handleCreateRecurringPayment = async () => {
        try {
            setErrors({})
            const token = getToken(state?.tokenAddress, state?.safeAddress)
            let m = _find(ReceiversList, (m) => m._id === state?.receiver)
            const currentAllowance = await getSpendingAllowance({ delegate: m?.wallet, token: state?.tokenAddress });
            console.log(currentAllowance)
            let err: any = {}
            if (!state?.receiver)
                err.receiver = 'Please select valid receiver'
            if (!state?.startDate)
                err.startDate = 'Please select valid startdate'
            if (!state?.ends || (state?.ends && state?.ends.value !== "NEVER" && (!state?.ends?.occurances || state?.ends?.occurances === "" || state?.ends?.occurances === "0" || !state?.ends?.endOn )))
                err['ends'] = 'Please select valid end'
            if(!state?.safeAddress)
                err.safeAddress = 'Please select valid safeAddress'
            if(!state?.amount || +state?.amount == 0 || !state?.tokenAddress)
                err.safeAddress = 'Please select valid compensation'
            if (Object.keys(err).length > 0) {
                console.log(err)
                setErrors(err)
                return;
            }

            let amount = _get(state, 'amount');
            let resetMins = +moment.duration(moment().startOf('day').add(30, 'days').diff(moment().startOf('day'))).asMinutes()
            let resetBaseMins = Math.floor((moment().unix() / 60))
            if (state?.frequency === 'weekly')
                amount = (amount * 4)

            if (currentAllowance && currentAllowance?.amount > 0) {
                amount = amount + currentAllowance?.amount
                resetMins = currentAllowance.resetTimeMin
                resetBaseMins = currentAllowance.lastResetMin
            }
            const memberName = m.name && m.name !== "" ? m.name : beautifyHexToken(m.wallet)
            const txnHash = await setAllowance({
                allowance: [{ token: state?.tokenAddress, amount: `${BigInt(parseFloat(amount) * 10 ** _get(token, 'token.decimal', 18))}`, resetMins: `${resetMins}`, resetBaseMins: `${resetBaseMins}` }],
                label: `Approval for ${state?.frequency} payment | ${memberName} | ${_get(state, 'amount')} ${_get(token, 'token.symbol')}`,
                actualAmount: state?.amount,
                delegate: _get(m, 'wallet', null),
            })
            const payload = {
                daoId: _get(DAO, '_id', null),
                safeAddress: state?.safeAddress,
                receiver: state?.receiver,
                delegate: state?.receiver,
                compensation: {
                    symbol: token?.token?.symbol,
                    currency: state?.tokenAddress,
                    amount: state?.amount
                },
                frequency: state?.frequency,
                startDate: moment(state?.startDate, 'YYYY-MM-DD').startOf('day').utc().toDate(),
                ends: {
                    key: state?.ends?.value,
                    value: state?.ends?.value === "ON" ? state?.ends?.endOn : state?.ends?.value === "AFTER" ? state?.ends?.occurances : null
                },
                allowanceTxnHash: txnHash?.safeTxHash,
            }
            await axiosHttp.post(`recurring-payment`, payload)
            setTimeout(() => {
                // onRecurringPaymentCreated()
                // toggleShowCreateRecurring()
            }, 100)
        } catch (e) {
            console.log(e)
        }
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
            <Box display="flex" flexDirection="column" mt={6} mb={3} alignItems="center">
                <img src={RecurringPaymentSvg} />
                <Typography my={4} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Recurring Payment</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Box width={380}>
                    <Box my={2}>
                        <TextInput value={state?.receiver} onChange={(e:any) => setState((prev:any) => { return { ...prev, receiver: e.target.value } })} label="Receiver" size="medium" select fullWidth>
                            {
                                ReceiversList?.map((_o:any) => {
                                    return (
                                        <MenuItem key={_o._id} value={_o._id}>
                                            {/* <Avatar name={_o?.name} wallet={_o?.wallet} /> */}
                                            {`${_o?.name} (${ beautifyHexToken(_o?.wallet) })`}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextInput>
                    </Box>
                    <Box my={2}>
                        <TextInput
                            id="outlined-select-currency"
                            select
                            fullWidth
                            label="Treasury"
                            value={state?.safeAddress}
                            onChange={(e: any) => {
                                setState((prev:any) => { return {
                                    ...prev,
                                    safeAddress: e.target.value,
                                    tokenAddress: _get(_get(safeTokens, e.target.value, []), '[0].tokenAddress', 'SWEAT')
                                } })
                            }}
                        >
                            {
                                DAO?.safes?.map((safe: any) => {
                                    return (
                                        <MenuItem key={safe?.address} value={safe?.address}>{(safe?.name || "Multi-sig wallet") + " (" + beautifyHexToken(safe?.address) + ")"}</MenuItem>
                                    )
                                })
                            }
                        </TextInput>
                    </Box>
                    <Box my={2} id="error-currency-amt">
                        <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Compensation</Typography>
                        <CurrencyInput
                            value={state?.amount}
                            onChange={(e:any) => setState((prev:any) => { return { ...prev, amount: e } })}
                            options={_get(safeTokens, state?.safeAddress, []).map((token: any) => { return { label: token?.token?.symbol, value: token?.tokenAddress } })}
                            dropDownvalue={state?.tokenAddress}
                            onDropDownChange={(value: any) => {
                                setState((prev:any) => { return { ...prev, tokenAddress: _get(_get(safeTokens, value, []), '[0].tokenAddress', 'SWEAT') } })
                            }}
                            variant="primary"
                        />
                    </Box>   
                    <Box my={2}>
                        <TextInput
                            id="outlined-select-currency"
                            select
                            fullWidth
                            label="Frequency"
                            value={state?.safeAddress}
                            onChange={(e: any) => {
                                setState((prev:any) => { return {
                                    ...prev,
                                    safeAddress: e.target.value,
                                    tokenAddress: _get(_get(safeTokens, e.target.value, []), '[0].tokenAddress', 'SWEAT')
                                } })
                            }}
                        >
                            {
                                FREQUENCY?.map((frequency: any) => {
                                    return (
                                        <MenuItem key={frequency?.value} value={frequency?.value}>{frequency?.label}</MenuItem>
                                    )
                                })
                            }
                        </TextInput>
                    </Box>
                    <Box my={2}>
                        <TextInput
                            date
                            fullWidth
                            label="Start Date"
                            value={state?.startDate ? moment(state?.startDate, 'YYYY-MM-DD') : undefined}
                            onChange={(e: any) => {
                                setState((prev:any) => { return {
                                    ...prev,
                                    startDate: moment(e).format('YYYY-MM-DD'),
                                } })
                            }}
                        >
                        </TextInput>
                    </Box>    
                    <Box my={2}>
                        <Typography>Ends</Typography>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell  sx={{ display: 'flex', flexDirection: "row", alignItems: 'center' }}>
                                            <Checkbox onChange={() => setState((prev:any) => { return {
                                                ...prev,
                                                ends: { ...prev?.ends, value: "NEVER", occurances: undefined, endOn: undefined }
                                            } })} checked={state?.ends?.value === 'NEVER'} />
                                            <Typography>Never</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell  sx={{ display: 'flex', flexDirection: "row", alignItems: 'center' }}>
                                            <Checkbox onChange={() => setState((prev:any) => { return {
                                                ...prev,
                                                ends: { ...prev?.ends, value: "ON", occurances: undefined, endOn: undefined  }
                                            } })} checked={state?.ends?.value === 'ON'} />
                                            <Typography>On</Typography>
                                        </TableCell>
                                        <TableCell>
                                        <TextInput
                                            date
                                            size="small"
                                            fullWidth
                                            disabled={state?.ends?.value !== 'ON'}
                                            defaultValue={state?.ends?.endOn ? moment(state?.ends?.endOn, 'YYYY-MM-DD') : undefined}
                                            value={state?.ends?.endOn ? moment(state?.ends?.endOn, 'YYYY-MM-DD') : undefined}
                                            onChange={(e: any) => {
                                                setState((prev:any) => { return {
                                                    ...prev,
                                                    ends: { ...prev?.ends, endOn: moment(e).format('YYYY-MM-DD') },
                                                } })
                                            }}
                                        />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell  sx={{ display: 'flex', flexDirection: "row", alignItems: 'center' }}>
                                            <Checkbox onChange={() => setState((prev:any) => { return {
                                                ...prev,
                                                ends: { ...prev?.ends, value: "AFTER", occurances: undefined, endOn: undefined  }
                                            } })} checked={state?.ends?.value === 'AFTER'} />
                                            <Typography>After</Typography>
                                        </TableCell>
                                        <TableCell >
                                            <AmountInput disabled={state?.ends?.value !== 'AFTER'} height={50} width={180} 
                                                onChange={(e:any) => setState((prev:any) => { return {
                                                    ...prev,
                                                    ends: { ...prev?.ends, occurances: parse(e) }
                                                } })}
                                                value={format(state?.ends?.occurances)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box> 
                </Box>
            </Box>
            <Box style={{ background: 'linear-gradient(0deg, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)', width: 430, position: 'fixed', bottom: 0, borderRadius: '0px 0px 0px 20px' , padding: "30px 0 20px" }}>
                    <Box display="flex" mt={4} width={380} style={{ margin: '0 auto' }} flexDirection="row">
                        <Button onClick={() => onClose()} sx={{ mr:1 }} fullWidth variant='outlined' size="small">Cancel</Button>
                        <Button onClick={() => handleCreateRecurringPayment()} sx={{ ml:1 }}  fullWidth variant='contained' size="small">Create</Button>
                    </Box>
            </Box>
        </Box>
    </Drawer>
    )
}
