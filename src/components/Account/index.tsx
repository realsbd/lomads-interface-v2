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
import ChainSwitchList from 'components/ChainSwitchList';

const useStyles = makeStyles((theme: any) => ({
  root: {
    position: 'relative',
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
  },
  sliderInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    height: 60, 
    right: 223,
    padding: "12px 42px 12px 11px",
    borderRadius: "30px 0 0 30px",
    backgroundColor: 'hsla(214,9%,51%,.05)'
  },
  rolePill: {
    color: '#76808d',
    gap: '23px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 20px',
    height: 36,
    minWidth: 156,
    borderRadius: 100,
    backgroundColor: "hsla(214,9%,51%,.05)"
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
      <Box id="account-options" { ...props }
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
        <Box className={classes.sliderInfo}>
             <Box className={classes.rolePill}>
                <Typography style={{ fontSize: '14px', clear: 'both', display: 'inline-block', textAlign: 'center', whiteSpace: 'nowrap' }}>Active contributor</Typography>
             </Box>
             <Box>

             </Box>
             <ChainSwitchList chainId={chainId} />
        </Box>
      </Box>
      <Menu
        id="account-options-menu"
        MenuListProps={{
        'aria-labelledby': 'account-options',
        }}
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