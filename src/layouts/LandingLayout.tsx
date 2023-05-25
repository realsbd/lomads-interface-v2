import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/system';
import Account from 'components/Account';
import { useWeb3Auth } from 'context/web3Auth';
import { useAppSelector } from 'helpers/useAppSelector';

const useStyles = makeStyles((theme: any) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%);'
  },
}));

export default ({ children } : any) => {
  const { account } = useWeb3Auth();
  //@ts-ignore
  const { token } = useAppSelector(store => store.session)
  const classes = useStyles();

  return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        {  account && token &&
          <Box style={{ position: 'absolute', top: 24, right: 32 }}>
            <Account options={false} />
          </Box>
        }
        <Container maxWidth="lg">
          { children }
        </Container>
      </Grid>
  );
}