import React, { useState, useEffect, useMemo } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { Paper, Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";
import MuiSelect from "components/Select";

import CloseSVG from 'assets/svg/closeNew.svg'

import { useDAO } from "context/dao";
import { useAppDispatch } from "helpers/useAppDispatch";
import { useAppSelector } from "helpers/useAppSelector";
import theme from "theme";
import { useWeb3Auth } from 'context/web3Auth';
import Avatar from "boring-avatars";
import diamondIcon from 'assets/svg/Rectangle 543.svg'
import hkLogo from 'assets/svg/income.svg'

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalConatiner: {
        width: 930,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '36px !important',
        position: 'relative',
        overflow: 'scroll !important',
    },
    addMemberBtn: {
        width: '215px',
        height: '40px',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), - 3px - 3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px !important',
        fontSize: '14px !important',
        color: '#C94B32 !important'
    },
}));

interface Props {
    open: boolean;
    closeModal(): any;
}

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { DAO } = useDAO();
    const { account } = useWeb3Auth();
    // @ts-ignore
    const { user } = useAppSelector(store => store?.session);

    const [name, setName] = useState<string>('');
    const [errorName, setErrorName] = useState('');

    const [chain, setChain] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name)
        }
    }, [user]);

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            open={open}
            sx={{ zIndex: theme.zIndex.appBar + 1 }}
        >
            <Box className={classes.modalConatiner}>
                <Box sx={{ width: '100%', marginBottom: '45px' }} display="flex" alignItems="center" justifyContent={"flex-end"}>
                    <IconButton onClick={closeModal}>
                        <img src={CloseSVG} />
                    </IconButton>
                </Box>

                <Box sx={{ Width: '100%' }} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
                    <Avatar
                        size={60}
                        name={account}
                        variant="marble"
                        colors={["#E67C40", "#EDCD27", "#8ECC3E", "#2AB87C", "#188C8C"]}
                    />
                    <Typography sx={{ margin: '20px 0', fontSize: 30, color: '#C94B32' }}>Welcome,{user?.name}</Typography>
                    <Typography sx={{ color: '#76808D', fontSize: 16 }}>Set your info, privacy, and security</Typography>
                </Box>

                <Box sx={{ width: '95%', marginTop: '40px' }} display={"flex"} flexDirection={"column"}>
                    <Box sx={{ width: 350, marginBottom: '35px' }}>
                        <TextInput
                            label="Name"
                            placeholder="Name"
                            fullWidth
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); setErrorName('') }}
                            error={errorName !== ''}
                            id={errorName !== '' ? "outlined-error-helper-text" : ""}
                            helperText={errorName}
                        />
                    </Box>

                    <Box sx={{ width: '100%', marginBottom: '35px' }} display={"flex"} flexDirection={"column"}>
                        <Typography sx={{ fontWeight: 700, color: '#76808D', marginBottom: '5px' }}>My SBTS</Typography>
                        <Box sx={{ width: '100%' }} display={"flex"} flexWrap={"wrap"}>
                            <Box sx={{ width: 250, height: 150, overflow: 'hidden', borderRadius: '5px', marginBottom: '10px', marginRight: '10px', position: 'relative' }}>
                                <Box
                                    display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}
                                    sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'rgba(118, 128, 141, 0.5)', padding: '15px' }}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <img src={diamondIcon} alt="diamondIcon" style={{ width: 10, height: 10, marginRight: 5 }} />
                                        <Typography sx={{ fontSize: 14, color: '#FFF', fontWeight: 700 }}>Name of SBT</Typography>
                                    </Box>
                                </Box>
                                <img style={{ width: '100%', height: '100%' }} src="https://www.zicasso.com/static/5d94eddebd84649d25f26624b545d879/6d821/5d94eddebd84649d25f26624b545d879.jpg" />
                            </Box>
                            <Box sx={{ width: 250, height: 150, overflow: 'hidden', borderRadius: '5px', marginBottom: '10px', marginRight: '10px', position: 'relative' }}>
                                <Box
                                    display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}
                                    sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'rgba(118, 128, 141, 0.5)', padding: '15px' }}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <img src={diamondIcon} alt="diamondIcon" style={{ width: 10, height: 10, marginRight: 5 }} />
                                        <Typography sx={{ fontSize: 14, color: '#FFF', fontWeight: 700 }}>Name of SBT</Typography>
                                    </Box>
                                </Box>
                                <img style={{ width: '100%', height: '100%' }} src="https://www.zicasso.com/static/5d94eddebd84649d25f26624b545d879/6d821/5d94eddebd84649d25f26624b545d879.jpg" />
                            </Box>
                            <Box sx={{ width: 250, height: 150, overflow: 'hidden', borderRadius: '5px', marginBottom: '10px', marginRight: '10px', position: 'relative' }}>
                                <Box
                                    display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}
                                    sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'rgba(118, 128, 141, 0.5)', padding: '15px' }}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <img src={diamondIcon} alt="diamondIcon" style={{ width: 10, height: 10, marginRight: 5 }} />
                                        <Typography sx={{ fontSize: 14, color: '#FFF', fontWeight: 700 }}>Name of SBT</Typography>
                                    </Box>
                                </Box>
                                <img style={{ width: '100%', height: '100%' }} src="https://www.zicasso.com/static/5d94eddebd84649d25f26624b545d879/6d821/5d94eddebd84649d25f26624b545d879.jpg" />
                            </Box>
                            <Box sx={{ width: 250, height: 150, overflow: 'hidden', borderRadius: '5px', marginBottom: '10px', marginRight: '10px', position: 'relative' }}>
                                <Box
                                    display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}
                                    sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'rgba(118, 128, 141, 0.5)', padding: '15px' }}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <img src={diamondIcon} alt="diamondIcon" style={{ width: 10, height: 10, marginRight: 5 }} />
                                        <Typography sx={{ fontSize: 14, color: '#FFF', fontWeight: 700 }}>Name of SBT</Typography>
                                    </Box>
                                </Box>
                                <img style={{ width: '100%', height: '100%' }} src="https://www.zicasso.com/static/5d94eddebd84649d25f26624b545d879/6d821/5d94eddebd84649d25f26624b545d879.jpg" />
                            </Box>
                            <Box sx={{ width: 250, height: 150, overflow: 'hidden', borderRadius: '5px', marginBottom: '10px', marginRight: '10px', position: 'relative' }}>
                                <Box
                                    display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}
                                    sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'rgba(118, 128, 141, 0.5)', padding: '15px' }}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <img src={diamondIcon} alt="diamondIcon" style={{ width: 10, height: 10, marginRight: 5 }} />
                                        <Typography sx={{ fontSize: 14, color: '#FFF', fontWeight: 700 }}>Name of SBT</Typography>
                                    </Box>
                                </Box>
                                <img style={{ width: '100%', height: '100%' }} src="https://www.zicasso.com/static/5d94eddebd84649d25f26624b545d879/6d821/5d94eddebd84649d25f26624b545d879.jpg" />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%' }} display={"flex"} flexDirection={"column"}>
                        <Box sx={{ width: '100%', marginBottom: '20px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box sx={{ width: '50%' }} display={"flex"} alignItems={"center"}>
                                <Typography sx={{ marginRight: '30px', fontSize: 16, fontWeight: 700, color: '#76808D' }}>My Earnings</Typography>
                                <Box sx={{ width: '175px' }}>
                                    <MuiSelect
                                        options={[{ value: 'Polygon', label: 'Polygon' }, { value: 'Goerli', label: 'Goerli' }]}
                                        selected={chain}
                                        setSelectedValue={(value) => setChain(value)}
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Button size="small" variant="contained" color="secondary" className={classes.addMemberBtn}>
                                    REQUEST PAYMENT
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            sx={{ width: '100%', height: '60px', background: 'rgba(118, 128, 141, 0.05)', borderRadius: '5px', marginBottom: '20px', padding: '0 20px' }}
                            display={"flex"} alignItems={"center"} justifyContent={"space-between"}
                        >
                            <Box display={"flex"} alignItems={"center"}>
                                <Box sx={{ marginRight: '16px' }} display={"flex"} alignItems={"center"}>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700, marginRight: "5px" }}>24</Typography>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700 }}>SWEAT</Typography>
                                </Box>
                                <Box sx={{ marginRight: '16px' }} display={"flex"} alignItems={"center"}>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700, marginRight: "5px" }}>240</Typography>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700 }}>HK</Typography>
                                </Box>
                                <Box sx={{ marginRight: '16px' }} display={"flex"} alignItems={"center"}>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700, marginRight: "5px" }}>240</Typography>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700 }}>BV</Typography>
                                </Box>
                                <Box sx={{ marginRight: '16px' }} display={"flex"} alignItems={"center"}>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700, marginRight: "5px" }}>240</Typography>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700 }}>RHO</Typography>
                                </Box>
                                <Box sx={{ marginRight: '16px' }} display={"flex"} alignItems={"center"}>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700, marginRight: "5px" }}>240</Typography>
                                    <Typography sx={{ color: '#76808D', fontWeight: 700 }}>ETH</Typography>
                                </Box>
                            </Box>
                            <Box display={"flex"} alignItems={"center"}>
                                <img src={hkLogo} alt="icon-alt" style={{ marginRight: '5px' }} />
                                <Typography sx={{ color: '#188C7C', fontWeight: 700, marginRight: '2px' }}>$83,40</Typography>
                                <Typography sx={{ color: '#76808D', fontWeight: 700 }}>total</Typography>
                            </Box>
                        </Box>

                    </Box>

                </Box>
            </Box>
        </Drawer>
    )
}