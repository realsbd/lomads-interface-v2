import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react'
import { throttle as _throttle, debounce as _debounce, get as _get, find as _find } from 'lodash'
import { Container, Grid, Typography, Box, Paper, Menu } from "@mui/material"
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';
import CHEERS from 'assets/svg/cheers.svg'
import LOMADS_LOGO from 'assets/svg/lomadsfulllogo.svg'
import METAMASK from 'assets/svg/metamask.svg'
import GMAIL from 'assets/images/gmail.png'
import APPLE from 'assets/images/apple.png'
import { KeyboardArrowDown } from '@mui/icons-material';
import { SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains';
import toast from 'react-hot-toast';
import { createAccountAction, setTokenAction, setNetworkConfig, logoutAction, setUserAction } from 'store/actions/session';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from "components/Button";
import { useWeb3Auth } from 'context/web3Auth';
import { WALLET_ADAPTERS } from "@web3auth/base";
import { ethers } from 'ethers';
import { CHAIN_INFO } from 'constants/chainInfo';

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: "100vh",
        maxHeight: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden !important'
    },
    logo: {
        width: 138,
        height: 81
    },
    cheers: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center'
    },
    metamaskButton: {
        height: '111px !important',
        cursor: 'pointer',
        alignContent: "inherit",
        background: "#fff",
        borderColor: "#c94b32",
        borderRadius: '10px !important',
        borderWidth: 0,
        filter: "drop-shadow(3px 5px 4px rgba(27,43,65,.05)) drop-shadow(-3px -3px 8px rgba(201,75,50,.1)) !important",
        margin: "10px",
        padding: 40
    },
    select: {
        background: '#FFF',
        borderRadius: '10px !important',
        boxShadow: 'none !important',
        fontSize: '16px !important',
        minWidth: 'inherit !importnt',
        padding: '0px !important'
    }
}));

export default () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const from = searchParams.get("from")
    const { token, user, selectedChainId } = useSelector((store: any) => store.session);
    const [currentChain, setCurrentChain] = useState(SupportedChainId.GOERLI)
    const [reloaded, setReloaded] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const { provider, login, account, chainId, logout } = useWeb3Auth();

    console.log("provider", provider)


    // useEffect(() => {
    //     if(window?.ethereum){
    //         const chainInfo = CHAIN_INFO[+_get(window?.ethereum, 'networkVersion', 5)]
    //         dispatch(setNetworkConfig({ selectedChainId: +_get(window?.ethereum, 'networkVersion', 5), chain: chainInfo.chainName, web3AuthNetwork: chainInfo.network }))
    //     }
    // }, [window?.ethereum])

    // const handleOnMessage = (message: any) => {
    //     if(message?.data?.data?.data?.method === "metamask_chainChanged" && message?.data?.data?.data?.params?.networkVersion !== "loading") {
    //         console.log("+message?.data?.data?.data?.method?.params?.networkVersion", message?.data?.data?.data?.params?.networkVersion)
    //         if(!isNaN(+message?.data?.data?.data?.params?.networkVersion)) {
    //             const chainInfo = CHAIN_INFO[+message?.data?.data?.data?.params?.networkVersion]
    //             if(chainInfo) {
    //                 dispatch(setNetworkConfig({ selectedChainId: +message?.data?.data?.data?.params?.networkVersion, chain: chainInfo.chainName, web3AuthNetwork: chainInfo.network }))
    //             }
    //         }
    //     }
    // }

    // useEffect(() => {
    //     window.addEventListener("message", handleOnMessage);
    //     return () => {
    //       window.removeEventListener("message", handleOnMessage);
    //     };
    //   }, []);

    useEffect(() => {
        setCurrentChain(selectedChainId)
    }, [selectedChainId])

    useEffect(() => {
        if (token && user && account) {
            if (from)
                navigate(from)
            else
                navigate('/')
        }
    }, [token, user, account])

    const handleSwitchNetwork = _throttle(async (chain: any) => {
        const chainInfo = CHAIN_INFO[chain]
        console.log(chainInfo)
        dispatch(setNetworkConfig({ selectedChainId: chain, chain: chainInfo.chainName, web3AuthNetwork: chainInfo.network }))
        setCurrentChain(chain)
    }, 1000)

    const handleLogin = async (loginType = WALLET_ADAPTERS.METAMASK, provider: undefined | string = undefined) => {
        dispatch(logoutAction())
        await logout()
        let token = null;
        if (loginType === WALLET_ADAPTERS.METAMASK) {
            token = await login(loginType);
        } else if (loginType === WALLET_ADAPTERS.OPENLOGIN) {
            token = await login(WALLET_ADAPTERS.OPENLOGIN, provider);
        }
        if (token) {
            dispatch(createAccountAction({ token }))
        }
    }

    return (
        <>
            <Grid container className={classes.root}>
                <Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
                    <Box zIndex={0} position="absolute" bottom={0}>
                        <img src={CHEERS} style={{ marginBottom: '-5px' }} />
                    </Box>
                    <Box mb={12} mt={3}>
                        <img src={LOMADS_LOGO} />
                    </Box>
                    <Typography my={1} variant="subtitle1">Hello there !</Typography>
                    <Typography mt={2} mb={4} color="primary" variant="h2">Connect Your Wallet</Typography>
                    <Box display="flex" flexDirection="row">
                        <Button onClick={() => handleLogin(WALLET_ADAPTERS.METAMASK)} className={classes.metamaskButton} variant='contained' color='secondary'>
                            <img src={METAMASK} />
                        </Button>
                        {/* <Button onClick={() => handleLogin(WALLET_ADAPTERS.OPENLOGIN)} className={classes.metamaskButton} style={{ marginLeft: 8, minWidth: 252 }} variant='contained' color='secondary'>
                            <img style={{ width: 120 }} src={GMAIL} />
                        </Button> */}
                    </Box>
                    <Typography mt={2} variant="h2" style={{ fontSize: '16px', color: 'rgba(27, 43, 65, 0.5)', cursor: 'pointer' }}>Continue without wallet</Typography>
                    <Box sx={{ mt: 2 }}  display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                            <Box onClick={() => handleLogin(WALLET_ADAPTERS.OPENLOGIN, 'google')} style={{ marginRight: 8 }}>
                                <img style={{ width: 100, cursor: 'pointer' }} src={GMAIL} />
                            </Box>
                            <Box onClick={() => handleLogin(WALLET_ADAPTERS.OPENLOGIN, 'apple')} style={{ marginLeft: 8 }}>
                                <img style={{ width: 80, cursor: 'pointer' }} src={APPLE} />
                            </Box>
                    </Box>
                    {/* <Box mt={4} display="flex" flexDirection="row" alignItems="center">
                        <Typography variant='body1' fontWeight="bold" mr={2}>Select Blockchain:</Typography>
                        <Button onClick={handleClick} aria-controls={open ? 'fade-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} className={classes.select} variant="contained" color="secondary" disableElevation startIcon={<img style={{ width: 18, height: 18 }} src={_get(CHAIN_INFO, `${currentChain}.logoUrl`)} />} endIcon={<KeyboardArrowDown />}>
                            {_get(CHAIN_INFO, `${currentChain}.label`)}
                        </Button>
                        <Menu
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            {
                                SUPPORTED_CHAIN_IDS.map(sc =>
                                    <MenuItem style={{ textTransform: 'uppercase' }} onClick={() => { handleSwitchNetwork(sc); handleClose() }}>
                                        <img style={{ marginRight: '8px', width: 18, height: 18 }} src={CHAIN_INFO[sc].logoUrl} />{CHAIN_INFO[sc].label}</MenuItem>)
                            }
                        </Menu>
                    </Box> */}
                    <Box height={200}></Box>
                </Grid>
            </Grid>
        </>
    )
}