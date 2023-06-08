import React, { useState } from "react";

import { Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";

import CloseSVG from 'assets/svg/closeNew.svg'
import MilestoneSVG from 'assets/svg/milestone.svg'
import Dropdown from "components/Dropdown";
import Avatar from "components/Avatar";
import LabelDropdown from "components/LabelDropdown";
import theme from "theme";

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
    label: {
        fontSize: '16px !important',
        lineHeight: '18px !important',
        color: '#76808d',
        fontWeight: '700 !important',
        marginBottom: '8px !important'
    },
    dropdown: {
        background: 'linear-gradient(180deg, #FBF4F2 0 %, #EEF1F5 100 %) !important',
        borderRadius: '10px',
    },
    divider: {
        width: 210,
        border: '2px solid #C94B32',
        margin: '35px 0 !important'
    },
    mileStonePaper: {
        width: 340,
        padding: '20px 22px !important',
        background: '#FFF !important',
        boxShadow: '0px 3px 3px rgba(27, 43, 65, 0.1), -1px -2px 3px rgba(201, 75, 50, 0.05) !important',
        borderRadius: '5px !important',
        marginBottom: '35px !important'
    },
    paperTitle: {
        fontSize: '16px !important',
        fontWeight: '700 !important',
        lineHeight: '18px !important',
        color: '#B12F15',
        marginBottom: '20px !important'
    }
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
            sx={{ zIndex: theme.zIndex.appBar + 1 }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={MilestoneSVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Assign Contributions</Typography>
                    <Typography className={classes.modalSubtitle}>Mark the milestone as completed and reward the contributors</Typography>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent={"space-between"} alignItems={"center"} sx={{ width: '100%', height: '100%' }}>
                    <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%' }}>

                        <Box display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '35px' }}>
                            <Button
                                variant='contained'
                                color="secondary"
                                size="small"
                                sx={{ width: 185, color: '#C94B32', fontSize: 14, marginRight: '16px' }}
                                onClick={() => console.log("Clicked")}
                            >
                                SPLIT EQUALLY
                            </Button>
                            <Box sx={{ width: 185 }}>
                                <LabelDropdown />
                            </Box>
                        </Box>

                        {
                            [1, 2, 3].map((item, index) => {
                                return (
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ width: 350 }}>
                                        <Box>
                                            <Avatar name="Zohaib" wallet="0xA015C8B6844Fa3294209f413F32Da90e92c45F5a" />
                                        </Box>
                                        <Box>
                                            <TextInput
                                                type="number"
                                                min={0}
                                                max={100}
                                                sx={{ width: 100 }} />
                                        </Box>
                                        <Box>
                                            <Typography>= 0 SWEAT</Typography>
                                        </Box>
                                    </Box>
                                )
                            })
                        }

                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%' }}>
                        <Button fullWidth size="small" variant="outlined" sx={{ marginRight: '20px' }}>CANCEL</Button>
                        <Button fullWidth size="small" variant="contained">SAVE</Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    )
}