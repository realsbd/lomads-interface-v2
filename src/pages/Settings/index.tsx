import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ChevronRight } from "@mui/icons-material";

import OrganistionDetails from "assets/images/settings-page/1-ogranisation-details.svg";
import RolesPermissions from "assets/images/settings-page/2-roles-permissions.svg";
import Safe from "assets/images/settings-page/3-safe.svg";
import PassTokens from "assets/images/settings-page/4-pass-tokens.svg";
import XpPoints from "assets/images/settings-page/5-xp-points.svg";
import Terminology from "assets/images/settings-page/6-terminology.svg";
import IntegrationGrey from "assets/svg/integrations.svg";


const useStyles = makeStyles((theme: any) => ({
    item: {
        cursor: 'pointer',
        backgroundColor: '#FFF',
        width: '100%',
        height: 130,
        borderRadius: 20,
        padding: 25,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    title: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '400 !important',
        fontSize: '20px !important',
        lineHeight: '25px !important',
        letterSpacing: '-0.011em',
        color: '#C94B32'
    }
  }));

const Content = ({ icon, title }: { icon: any | undefined, title: string | undefined }) => {
    const classes = useStyles();
    return (
        <Box className={classes.item}>
            <Box>
                <img src={icon} />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <Typography className={classes.title}>{ title }</Typography>
                <ChevronRight color="primary"/>
            </Box>
        </Box>
    )
}

export default () => {
    return (
        <Grid container px={3} spacing={2}>
            <Grid item sm={12}>
                <Content icon={OrganistionDetails} title="Organisation Details" />
            </Grid>
            <Grid item sm={6} md={4} xs={1}>
                <Content icon={RolesPermissions} title="Roles & Permissions" />
            </Grid>
            <Grid item sm={6} md={4} xs={1}>
                <Content icon={Safe} title="Safe" />
            </Grid>
            <Grid item sm={6} md={4} xs={1}>
                <Content icon={PassTokens} title="Pass Tokens" />
            </Grid>
            <Grid item sm={6} md={4} xs={1}>
                <Content icon={XpPoints} title="XP Points" />
            </Grid>
            <Grid item sm={6} md={4} xs={1}>
                <Content icon={Terminology} title="Tags & Terminology" />
            </Grid>
            <Grid item sm={6} md={4} xs={1}>
                <Content  icon={IntegrationGrey} title="Integrations"/>
            </Grid>
        </Grid>
    )
}