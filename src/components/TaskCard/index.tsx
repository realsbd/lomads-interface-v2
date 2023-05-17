import React from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
import { makeStyles } from '@mui/styles';

import submitted from 'assets/svg/submitted.svg';
import calendarIcon from 'assets/svg/calendar.svg'

const useStyles = makeStyles((theme: any) => ({
    taskCard: {
        width: '315px',
        height: '110px',
        padding: '0 !important',
        marginRight: '20px !important',
        marginBottom: '15px !important',
        borderRadius: '5px !important',
        display: 'flex !important',
        cursor: 'pointer'
    },
    taskContent: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        "&:last-child": {
            padding: '0 15px !important'
        }
    },
    projectText: {
        fontSize: '14px !important',
        color: '#76808D !important',
        lineHeight: '16px !important',
    },
    taskText: {
        fontSize: '22px !important',
        color: '#B12F15 !important',
        marginTop: '3px !important',
        marginBottom: '10px !important',
        lineHeight: '25px !important',
    },
    statusText: {
        fontSize: '14px !important',
        color: '#6B99F7 !important',
        lineHeight: '16px !important',
        marginLeft: '5px !important'
    },
    dateText: {
        fontSize: '14px !important',
        fontWeight: '700 !important',
        color: '#76808D !important',
        lineHeight: '16px !important',
        marginLeft: '5px !important'
    },
}));

export default () => {
    const classes = useStyles();

    return (
        <>
            <Card
                className={classes.taskCard}
                sx={{
                    background: '#FFF',
                    boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
                }}
            >
                <CardContent className={classes.taskContent}>
                    <Typography className={classes.projectText}>Project Name</Typography>
                    <Typography className={classes.taskText}>Task Name</Typography>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Box display={"flex"} alignItems={"center"}>
                            <img src={submitted} alt="submitted-icon" />
                            <Typography className={classes.statusText}>Submitted</Typography>
                        </Box>
                        <Box display={"flex"} alignItems={"center"}>
                            <img src={calendarIcon} alt="calendarIcon" />
                            <Typography className={classes.dateText}>2 days</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}