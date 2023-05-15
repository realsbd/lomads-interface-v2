import React from "react";
import { Typography, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { SiNotion } from "react-icons/si";
import { BiLock } from "react-icons/bi";

interface ProjectLinkCardProps {
    isLocked: boolean
}

const useStyles = makeStyles((theme: any) => ({
    linkChip: {
        width: 'fit-content !important',
        height: '40px',
        padding: '0 6px !important',
        borderRadius: '100px !important',
        marginRight: '10px !important',
        marginBottom: '10px !important'
    },
    lockCircle: {
        height: '30px',
        width: '30px',
        borderRadius: '50% !important',
        background: '#B12F15',
        cursor: 'pointer !important'
    },
}));

export default ({ isLocked }: ProjectLinkCardProps) => {
    const classes = useStyles();

    if (isLocked) {
        return (
            <>
                <Box className={classes.linkChip} display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ background: '#C94B32' }}>
                    <Box sx={{ height: 30, width: 30 }} display="flex" alignItems={"center"} justifyContent={"center"}><SiNotion color={'#FFF'} size={20} /></Box>
                    <Typography sx={{ margin: '0 15px', color: '#FFF' }}>MARKETING VISUALS FOR CHRISTMAS</Typography>
                    <Box display="flex" alignItems={"center"} justifyContent={"center"} className={classes.lockCircle}><BiLock color="#FFF" /></Box>
                </Box>
            </>
        )
    }

    return (
        <>
            <Box className={classes.linkChip} display="flex" alignItems={"center"} justifyContent={"space-between"} sx={{ background: '#FFF' }}>
                <Box sx={{ height: 30, width: 30 }} display="flex" alignItems={"center"} justifyContent={"center"}><SiNotion color={'#B12F15'} size={20} /></Box>
                <Typography sx={{ margin: '0 15px', color: '#B12F15' }}>MARKETING VISUALS FOR CHRISTMAS</Typography>
            </Box>
        </>
    )
}