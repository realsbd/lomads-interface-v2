import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import palette from 'theme/palette';
import Avatar from '@mui/material/Avatar';
import useENS from 'hooks/useENS';
import { useEffect, useState } from 'react';
import { beautifyHexToken } from 'utils';
import AVATAR from 'assets/svg/avatar.svg'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { setTokenAction, setUserAction } from 'store/actions/session';
import { useWeb3Auth } from 'context/web3Auth';

const useStyles = makeStyles((theme: any) => ({
  root: {
    width: 223, 
    cursor: 'pointer',
    height: 60,
    background: `#FFFFFF`,
    boxShadow: `3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)`,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  address: {
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: '14px !important',
    lineHeight: '18px !important',
    letterSpacing: '-0.011em !important',
    color: 'rgb(144, 144, 144)',
  },
  dropdown: {
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeft: '1px solid #F0F0F0'
  }
}));

export default ({ children, ...props } : any) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { chainId, account, provider } = useWeb3Auth()
  const { getENSName } = useENS();
  const [accountName, setAccountName] = useState<string>();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () =>  setAnchorEl(null);
  useEffect(() => {
    if(account) {
      setAccountName(beautifyHexToken(account))
      getENSName(account)
      .then(ens => {
        if(ens)
          setAccountName(ens)
      })
    }
  }, [account])

  const disconnect = async () => {
    handleClose();
    // if (connector.deactivate) {
    //   connector.deactivate();
    // } else {
    //   connector.resetState();
    // }
    localStorage.clear()
    sessionStorage.clear()
    dispatch(setTokenAction(null))
    dispatch(setUserAction(null))
  };

  return (
    <>
      <Box { ...props }
        onClick={handleClick} className={classes.root}>
        <Box sx={{ pl: 2 }} display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
          <Avatar sx={{ width: 30, height: 30 }} src={AVATAR} variant="square"></Avatar>
          <Typography className={classes.address} sx={{ 
              mx: 1,
              width: 100,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
             }} variant="subtitle2">{ accountName }</Typography>
        </Box>
        <Box sx={{ p: 2 }} className={classes.dropdown}>
          <IconButton disabled>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => disconnect()}>Disconnect</MenuItem>
      </Menu>
    </>
  );
}