import React from "react";
import { get as _get } from 'lodash';
import { Paper, Box, Stack, Typography } from "@mui/material"
import { makeStyles } from '@mui/styles';
import IconButton from "components/IconButton";
import SettingsSVG from 'assets/svg/settings.svg';
import LinkChip from "components/LinkChip";
import { useDAO } from "context/dao";
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from "react-router-dom";
import useRole from "hooks/useRole";
import { useWeb3Auth } from "context/web3Auth";
import Organisation from "pages/Settings/Modals/Organisation";

const useStyles = makeStyles((theme: any) => ({
    root: {
      display: 'flex',
      height: '80px !important',
      width: '100%',
      backgroundColor: `#FFF`,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 5,
      padding: "0 20px"
    },
    stack: {
        flex: 1,
        overflow: 'hidden',
        overflowX: 'auto',
        margin: '0 16px 0 0'
    },
    empty: {
        alignItems: 'center',
        border: '1px dashed hsla(214,9%,51%,.5)',
        borderRadius: '100px',
        cursor: 'pointer',
        display: 'flex',
        height: '40px',
        justifyContent: 'center',
        width: '282px'
    },
    emptyText: {
        color: 'hsla(214,9%,51%,.5)'
    }
  }));

export default () => {
    const navigate = useNavigate()
    const classes = useStyles();
    const { DAO } = useDAO()
    const { account } = useWeb3Auth();
    const { myRole, can } = useRole(DAO, account, undefined)

    if(!DAO) {
        return (
            <Skeleton variant="rectangular" animation="wave" className={classes.root} />
        )
    }

    if (_get(DAO, 'links', []).length == 0 && !can(myRole, 'settings')) {
        return null
    }

    return (
        <Paper className={classes.root} elevation={0}>
            <Box className={classes.stack} flexGrow={1}>
                <Stack padding={"6px"} height={80} alignItems="center" spacing={2} direction="row">
                    {
                        _get(DAO, 'links', []).length > 0 ?
                        _get(DAO, 'links', []).map((link:any) => <LinkChip url={_get(link, 'link')} name={_get(link, 'title')} />) : 
                        <Box onClick={() => {
                            navigate(`/${DAO?.url}/settings`, { state: { openDefault: Organisation.name } })
                        }} className={classes.empty}>
                            <Typography className={classes.emptyText} >ADD USEFUL LINKS HERE</Typography>
                        </Box>
                    }
                </Stack>
            </Box>
            { can(myRole, 'settings') &&
            <IconButton onClick={() => navigate(`/${DAO?.url}/settings`)}>
                <img src={SettingsSVG} />
            </IconButton> }
        </Paper>
    )
}