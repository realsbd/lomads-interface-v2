import React, { useState } from "react";

import { Typography, Box, Drawer, Paper } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import Button from "components/Button";

import CloseSVG from 'assets/svg/closeNew.svg'
import KRASVG from 'assets/svg/kra.svg'
import RangeSlider from "components/RangeSlider";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalConatiner: {
        width: 575,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '27px !important',
        marginTop: '60px !important'
    },
    modalTitle: {
        color: '#C94B32',
        fontSize: '30px !important',
        fontWeight: '400',
        lineHeight: '33px !important',
        marginTop: '20px !important',
        marginBottom: '8px !important'
    },
    modalSubtitle: {
        color: '#76808d',
        fontSize: '14px !important',
        fontStyle: 'italic',
        marginBottom: '35px !important'
    },
    paperContainer: {
        borderRadius: 5,
        padding: '26px 22px',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important'
    },
}));

interface Props {
    open: boolean;
    closeModal(): any;
}

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 1 }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={KRASVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Key Results</Typography>
                    <Typography className={classes.modalSubtitle}>It's time to evaluate your scores</Typography>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent={"space-between"} alignItems={"center"} sx={{ width: '100%', height: '100%' }}>
                    <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%' }}>
                        <Typography className={classes.modalSubtitle}>Review Period: 15 May,2023 12:00 AM - 15 May,2023 11:59 PM</Typography>

                        <Paper className={classes.paperContainer} sx={{ width: '100%' }}>
                            <Box><Typography>KRA Title</Typography></Box>
                            <Box sx={{ width: '100%', marginTop: '10px' }} display="flex" alignItems={"center"} justifyContent={"space-between"}>
                                <Box sx={{ width: '250px' }}>
                                    <RangeSlider
                                        showThumb={true}
                                        disabled={false}
                                        onChange={() => console.log("Change")}
                                    />
                                </Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '16px' }}>0% done</Typography>
                            </Box>
                        </Paper>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%' }}>
                        <Button fullWidth size="small" variant="outlined" sx={{ marginRight: '20px' }}>LATER</Button>
                        <Button fullWidth size="small" variant="contained">SUBMIT</Button>
                    </Box>
                </Box>

            </Box>
        </Drawer>
    )
}