import React, { useState } from "react";

import { Grid, Paper, Typography, Box, Select, MenuItem, FormControl, Chip, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";

import CloseSVG from 'assets/svg/close-new.svg'
import ProjectResourceSVG from 'assets/svg/projectResource.svg'
import { AiOutlinePlus, AiFillQuestionCircle, AiOutlineLock } from "react-icons/ai";
import { IoCloseOutline } from 'react-icons/io5';

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
    },
    addLinkBtn: {
        width: 50,
        height: 50,
        background: 'rgba(27, 43, 65, 0.2) !important',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '0 !important'
    },
    linkArea: {
        width: '100% !important',
        padding: '26px 22px !important',
        background: 'rgba(118, 128, 141, 0.05) !important',
        boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1) !important',
        borderRadius: '5px !important',
        margin: '20px 0 !important'
    },
    linkRow: {
        width: '100% !important',
        height: '20px !important',
        marginBottom: '15px !important'
    },
    linkName: {
        width: '40% !important',
    },
    linkAddress: {
        width: '60% !important',
    }
}));

interface Props {
    open?: boolean;
    closeModal(): any;
}

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();
    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            // sx={{ zIndex: 1 }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={ProjectResourceSVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Project Resources</Typography>
                    <Typography className={classes.modalSubtitle}>Add links for online ressources </Typography>
                </Box>
                <Box display="flex" flexDirection="column" sx={{ width: '80%' }}>
                    <Typography className={classes.label}>Add links</Typography>
                    <Box display="flex" alignItems={"center"} justifyContent={"space-between"}>
                        <TextInput
                            sx={{ width: 145 }}
                            placeholder="Ex Portfolio"
                        />
                        <TextInput
                            sx={{ width: 195 }}
                            placeholder="link"
                        />
                        <Box
                            className={classes.addLinkBtn}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <AiOutlinePlus color="#FFF" size={25} />
                        </Box>
                    </Box>
                    <Box className={classes.linkArea}>
                        <Box className={classes.linkRow} display={"flex"} alignItems={"flex-start"} justifyContent={"space-between"}>
                            <Box className={classes.linkName} display={"flex"}>
                                <Typography>Portfolio</Typography>
                            </Box>
                            <Box className={classes.linkAddress}>
                                <Typography>https://iamzohaibkibria.vercel.app</Typography>
                            </Box>
                            {/* <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ width: 40, cursor: 'pointer' }}>
                                <IoCloseOutline />
                            </Box> */}
                        </Box>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%' }}>
                        <Button variant="outlined" sx={{ marginRight: '20px' }}>CANCEL</Button>
                        <Button variant="contained">ADD</Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    )
}