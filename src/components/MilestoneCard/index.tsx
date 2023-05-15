import React from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { FiCheck } from "react-icons/fi";

interface MilestoneCardProps {
    isComplete: boolean,
    openModal(action: boolean): void,
}

const useStyles = makeStyles((theme: any) => ({
    milestoneCard: {
        width: '315px',
        height: '60px',
        padding: '0 !important',
        marginRight: '20px !important',
        marginBottom: '15px !important',
        borderRadius: '5px !important',
        display: 'flex !important'
    },
    milestoneContent: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        "&:last-child": {
            padding: '0 15px !important'
        }
    },
    milestoneText: {
        fontSize: '14px !important',
        fontWeight: '700 !important',
        color: '#76808D'
    },
}));

export default ({ isComplete, openModal }: MilestoneCardProps) => {
    const classes = useStyles();

    if (isComplete) {
        return (
            <>
                <Card elevation={0} className={classes.milestoneCard} sx={{ background: 'rgba(24, 140, 124, 0.1)' }}>
                    <CardContent className={classes.milestoneContent}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ width: '85%' }}>
                            <Box display={"flex"} alignItems={"center"}>
                                <Typography className={classes.milestoneText} sx={{ marginRight: '0.5rem', color: '#188C7C' }}>1</Typography>
                                <Typography className={classes.milestoneText}>Milestone Name</Typography>
                            </Box>
                            <Typography sx={{ color: '#76808D' }}>11/12</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ height: 28, width: 28, borderRadius: 28, backgroundColor: '#188C7C', cursor: "pointer" }}>
                            <FiCheck size={20} color="#FFF" />
                        </Box>
                    </CardContent>
                </Card>
            </>
        )
    }

    return (
        <>
            <Card
                className={classes.milestoneCard}
                sx={{
                    background: '#FFF',
                    boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
                }}
            >
                <CardContent className={classes.milestoneContent}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ width: '85%' }}>
                        <Box display={"flex"} alignItems={"center"}>
                            <Typography className={classes.milestoneText} sx={{ marginRight: '0.5rem' }}>1</Typography>
                            <Typography className={classes.milestoneText}>Milestone Name</Typography>
                        </Box>
                        <Typography sx={{ color: '#76808D' }}>11/12</Typography>
                    </Box>
                    <Box
                        onClick={() => openModal(true)}
                        display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ height: 28, width: 28, borderRadius: 28, border: '1px solid rgba(118, 128, 141, 0.5)', cursor: "pointer" }}
                    >
                        <FiCheck size={20} />
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}