import React, { Fragment, useMemo, useState } from "react";
import { Box, Grid, Typography, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ChevronRight } from "@mui/icons-material";
import CloseSVG from 'assets/svg/close-new.svg'
import OrganistionDetails from "assets/images/settings-page/1-ogranisation-details.svg";
import RolesPermissions from "assets/images/settings-page/2-roles-permissions.svg";
import Safe from "assets/images/settings-page/3-safe.svg";
import PassTokens from "assets/images/settings-page/4-pass-tokens.svg";
import XpPoints from "assets/images/settings-page/5-xp-points.svg";
import Terminology from "assets/images/settings-page/6-terminology.svg";
import IntegrationGrey from "assets/svg/integrations.svg";
import Skeleton from '@mui/material/Skeleton';
import SafeModal from './Modals/Safe'
import IconButton from "components/IconButton";
import { useDAO } from "context/dao";

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
        fontSize: '18px !important',
        lineHeight: '25px !important',
        letterSpacing: '-0.011em',
        color: '#C94B32'
    }
  }));

const Content = ({ icon, title, onClick }: { icon: any | undefined, title: string | undefined, onClick: any }) => {
    const classes = useStyles();
    const { DAO } = useDAO()
    if(!DAO) {
        return (
            <Skeleton variant="rectangular"  animation="wave" height={130} className={classes.item} width={'100%'} />
        )
    }
    return (
        <Box onClick={onClick} className={classes.item}>
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

    const [activeModal, setActiveModal] = useState<string | null>(null);

    const Modal = useMemo(() => {
        if(activeModal === SafeModal.name)
            return SafeModal
        return Fragment
    }, [activeModal])

    return (
        <>
            <Grid container px={3} spacing={2}>
                <Grid item sm={12}>
                    <Content onClick={() => {}} icon={OrganistionDetails} title="Organisation Details" />
                </Grid>
                <Grid item sm={6} md={4} xs={1}>
                    <Content onClick={() => {}} icon={RolesPermissions} title="Roles & Permissions" />
                </Grid>
                <Grid item sm={6} md={4} xs={1}>
                    <Content onClick={() => setActiveModal(SafeModal.name)} icon={Safe} title="Safes" />
                </Grid>
                <Grid item sm={6} md={4} xs={1}>
                    <Content onClick={() => {}} icon={PassTokens} title="Pass Tokens" />
                </Grid>
                <Grid item sm={6} md={4} xs={1}>
                    <Content onClick={() => {}} icon={XpPoints} title="XP Points" />
                </Grid>
                <Grid item sm={6} md={4} xs={1}>
                    <Content onClick={() => {}} icon={Terminology} title="Tags & Terminology" />
                </Grid>
                <Grid item sm={6} md={4} xs={1}>
                    <Content onClick={() => {}} icon={IntegrationGrey} title="Integrations"/>
                </Grid>
            </Grid>
            <Drawer
                PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
                sx={{ zIndex: 99999 }}
                anchor={'right'}
                open={activeModal !== null}
                onClose={() => setActiveModal(null)}>
                    <Box sx={{ width: '575px', flex: 1, padding: '32px 72px 32px 72px', borderRadius: '20px 0px 0px 20px' }}>
                        <Modal onClose={() => setActiveModal(null)}/>
                    </Box>
            </Drawer>
        </>
    )
}