import React, { useEffect } from "react";
import lomadslogodark from "../../assets/svg/lomadslogodark.svg";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material"
import { makeStyles } from '@mui/styles';
import Button from "components/Button";

import img1 from 'assets/svg/img1.svg'
import img2 from 'assets/svg/img2.svg'
import img3 from 'assets/svg/img3.svg'
import img4 from 'assets/svg/img4.svg'
import Footer from "components/Footer";

const useStyles = makeStyles((theme: any) => ({
    DAOsuccess: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'center',
        overflowY: 'auto',
        padding: '0 1rem !important',
        marginTop: '10vh !important'
    },
    italicHeader: {
        fontWeight: '300 !important',
        fontStyle: 'italic !important',
        fontSize: '38px !important',
        lineHeight: '42px !important',
        textAlign: 'center',
        color: '#C94B32',
        textTransform: 'uppercase'
    },
    boldHeader: {
        fontWeight: '800 !important',
        fontSize: '38px !important',
        lineHeight: '42px !important',
        textAlign: 'center',
        color: '#1B2B41',
        textTransform: 'uppercase'
    },
    row: {
        width: '100%',
        height: '247px',
        background: '#FFF',
        borderRadius: '5px !important',
        boxShadow: '-3px -3px 8px 0px rgba(201, 75, 50, 0.10), 3px 5px 4px 0px rgba(27, 43, 65, 0.05) !important',
        overflow: 'hidden !important',
        marginBottom: '40px !important'
    },
    rowText: {
        fontSize: '18px !important',
        fontWeight: '400 !important',
        lineHeight: '22px !important',
        color: '#76808D',
        textAlign: 'center',

    }
}));

export default () => {
    const navigate = useNavigate();
    const classes = useStyles()


    return (
        <>
            <Box className={classes.DAOsuccess}>
                <Box>
                    <img src={lomadslogodark} alt="logo" style={{ width: '125px', height: '73px', objectFit: 'contain' }} />
                </Box>
                <Box sx={{ margin: '58px 0' }}>
                    <Typography className={classes.italicHeader}>Achieve unprecedented efficiency</Typography>
                    <Typography className={classes.boldHeader}>While empowering members of your</Typography>
                    <Typography className={classes.boldHeader}>organization with personal data sovereignty</Typography>
                    <Button variant='contained' sx={{ marginTop: '41px' }} onClick={() => navigate(`/organisation/create`)}>CREATE ORGANISATION</Button>
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="center">
                    <Typography sx={{ fontSize: '36px', fontWeight: '700', color: '#B12F15', lineHeight: '40px', marginBottom: '58px' }}>See what's inside</Typography>
                </Box>

                <Box className={classes.row} display={"flex"} alignItems={"center"}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ height: '100%', width: '60%', background: '#FDF7F5' }}>
                        <img src={img4} />
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ width: '40%' }}>
                        <Typography className={classes.rowText} sx={{ marginBottom: '25px' }}>Streamlined <span style={{ fontWeight: '700' }}>multi-treasury transaction</span><br />management</Typography>
                        <Typography className={classes.rowText}>Hassle-free <span style={{ fontWeight: '700' }}>financial reporting</span> with<br /><span style={{ fontWeight: '700' }}>automated labeling</span></Typography>
                    </Box>
                </Box>

                <Box className={classes.row} display={"flex"} alignItems={"center"}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ width: '40%' }}>
                        <Typography className={classes.rowText}>Versatile <span style={{ fontWeight: '700' }}>token based memberships</span><br />sell, whitelist, and beyond</Typography>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ height: '100%', width: '60%', background: '#FDF7F5' }}>
                        <img src={img3} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>

                </Box>

                <Box className={classes.row} sx={{ height: '192px' }} display={"flex"} alignItems={"center"}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ height: '100%', width: '60%', background: '#F5F5F5;' }}>
                        <img src={img2} />
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ width: '40%' }}>

                        <Typography className={classes.rowText}><span style={{ fontWeight: '700' }}>Effortless integrations</span><br />and <span style={{ fontWeight: '700' }}>auto-permissions</span> with Notion, Discord,<br />Github via membership tokens</Typography>
                    </Box>
                </Box>

                <Box className={classes.row} display={"flex"} alignItems={"center"}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"} sx={{ width: '40%' }}>
                        <Typography className={classes.rowText}>Record-keeping of validated contributions on<br /><span style={{ fontWeight: '700' }}>self-owned identity tokens</span></Typography>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ height: '100%', width: '60%', background: '#F5F5F5;' }}>
                        <img src={img1} />
                    </Box>

                </Box>

                <Footer theme="light" />
            </Box>
        </>
    );
};
