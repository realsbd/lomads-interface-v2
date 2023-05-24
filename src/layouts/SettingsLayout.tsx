import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Grid, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/system';
import Footer from 'components/Footer';

const useStyles = makeStyles((theme: any) => ({
  root: {
    background: 'linear-gradient(178.31deg, #C94B32 0.74%, #A54536 63.87%)'
  },
  content: {
    minHeight: 'calc(100vh - 80px)'
  }
}));

export default ({ children } : any) => {

  const classes = useStyles();

  return (
      <Box className={classes.root}>
        <Grid container component="main" className={classes.content}>
            <CssBaseline />
            <Container maxWidth="lg">
            { children }
            </Container>
        </Grid>
        <Container maxWidth="lg">
            <Footer theme='dark' />
        </Container>
      </Box>
  );
}