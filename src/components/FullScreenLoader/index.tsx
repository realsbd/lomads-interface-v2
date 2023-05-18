import * as React from 'react';
import { get as _get, find as _find } from 'lodash'
import { makeStyles } from '@mui/styles';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import palette from 'theme/palette';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import HeaderLogo from 'components/HeaderLogo';
import { useNavigate, useParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


const drawerWidth: number = 116;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  height: 107,
  boxShadow: 'inherit',
  backgroundColor: 'transparent',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
}));

const useStyles = makeStyles((theme: any) => ({
    root: {
      display: 'flex',
      background: `linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%)`,
    },
    main: {
        background: `linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%)`,
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    title: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '30px !important',
        lineHeight: '33px !important',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center'
    },
    description: {
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "14px",
        maxWidth: 200,
        lineHeight: "18px",
        letterSpacing: "-0.011em"
    },
    subtitle: {
        fontSize: '14px !important',
        fontWeight: '500',
        lineHeight: '19px !important',
    },
  }));

export default ({ children }: any) => {
  const classes = useStyles();
  const navigate = useNavigate()


  return (
      <Box className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" open={false}>
          <Toolbar
            style={{ background: 'transparent', height: '100%', paddingLeft: 0, paddingRight: 0 }}
          >
            <Skeleton variant="rectangular" width={116} height={107} sx={{ borderBottomRightRadius: 30 }} />
            <Box sx={{ mt: 0 }} style={{ padding: 0, height: '100%', flex: 1 }}>
                <Box display="flex" minHeight={107} sx={{ pb: 2, pt: 3, pr: 4 }} flexDirection="row" alignItems="flex-start">
                    <Box sx={{ flexGrow: 1, ml: 4 }}>
                        <Skeleton variant="text" className={classes.title} sx={{ marginLeft: "20px", width: 150 }} />
                        <Skeleton variant="text" className={classes.subtitle} sx={{ marginLeft: "20px", width: 600 }} />
                        <Skeleton variant="text" className={classes.subtitle} sx={{ marginLeft: "20px", width: 400 }} />
                    </Box>
                    <Skeleton variant="rectangular" width={223} height={60} sx={{ borderRadius: 30 }} />
                </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box style={{ width: drawerWidth, background: 'transparent' }} ></Box>
        <Box
          component="main"
          className={classes.main}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mb: 4, mt: '107px' }}>
            { children }
          </Container>
        </Box>
      </Box>
  );
}