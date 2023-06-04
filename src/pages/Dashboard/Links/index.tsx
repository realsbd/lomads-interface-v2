import React from "react";
import { get as _get } from 'lodash';
import { Paper, Box, Stack, Typography, Tooltip } from "@mui/material"
import { makeStyles } from '@mui/styles';
import IconButton from "components/IconButton";
import SettingsSVG from 'assets/svg/settings.svg';
import LinkChip from "components/LinkChip";
import BootstrapTooltip from "components/BootstrapTooltip"
import { useDAO } from "context/dao";
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from "react-router-dom";

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

export default ({ highlightSettings, isHelpIconOpen }: { highlightSettings: boolean, isHelpIconOpen: boolean }) => {
    const navigate = useNavigate()
    const classes = useStyles();
    const { DAO } = useDAO()

    if (!DAO) {
        return (
            <Skeleton variant="rectangular" animation="wave" className={classes.root} />
        )
    }

    return (
        <Paper className={classes.root} elevation={0}>
            <Box className={classes.stack} flexGrow={1}>
                <Stack padding={"6px"} height={80} alignItems="center" spacing={2} direction="row">
                    {
                        _get(DAO, 'links', []).length > 0 ?
                            _get(DAO, 'links', []).map((link: any) => <LinkChip url={_get(link, 'link')} name={_get(link, 'title')} />) :
                            <Box className={classes.empty}>
                                <Typography className={classes.emptyText} >ADD USEFUL LINKS HERE</Typography>
                            </Box>
                    }
                </Stack>
            </Box>
            <BootstrapTooltip open={isHelpIconOpen} 
                    placement="left-start"
                    title="Global Settings">
                <IconButton onClick={() => navigate(`/${DAO?.url}/settings`)}
                    sx={{
                        zIndex: highlightSettings ? 1400 : 0,
                        boxShadow: highlightSettings ? '0px 0px 20px rgba(181, 28, 72, 0.6)' : 'none'
                    }}
                    id="global-settings">
                    <img src={SettingsSVG} />
                </IconButton>
            </BootstrapTooltip>
        </Paper>
    )
}