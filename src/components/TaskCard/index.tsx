import React, { useMemo } from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
import { makeStyles } from '@mui/styles';

import submitted from 'assets/svg/submitted.svg';
import calendarIcon from 'assets/svg/calendar.svg'

import { useNavigate } from "react-router-dom";
import useTask from "hooks/useTask";

import moment from "moment";

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

interface CardProps {
    task: any;
    daoUrl: string;
}

export default ({ task, daoUrl }: CardProps) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { transformTask } = useTask();

    const Task = useMemo(() => {
        if (task)
            return transformTask(task)
    }, [task]);

    const handleCardClick = () => {
        navigate(`/${daoUrl}/task/${task._id}`, { state: { task } })
    }

    return (
        <>
            <Card
                className={classes.taskCard}
                sx={{
                    background: '#FFF',
                    boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
                }}
                onClick={handleCardClick}
            >
                <CardContent className={classes.taskContent}>
                    <Typography className={classes.projectText}>{Task?.project?.name?.length > 20 ? Task?.project?.name?.substring(0, 20) + "..." : Task?.project?.name}</Typography>
                    <Typography className={classes.taskText}>{Task.name.length > 20 ? Task.name.substring(0, 20) + "..." : Task.name}</Typography>
                    {
                        Task.draftedAt
                            ?
                            <Box style={{ border: '1px solid #C94B32', borderRadius: 16, padding: '4px 16px', width: '100px' }} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                <Typography style={{ color: '#C94B32' }}>Draft</Typography>
                            </Box>
                            :
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                <Box display={"flex"} alignItems={"center"}>
                                    <img src={Task?.visual?.icon} alt="submitted-icon" />
                                    <Typography className={classes.statusText} sx={{ color: Task?.visual?.color }}>{Task?.visual?.status}</Typography>
                                </Box>
                                <Box display={"flex"} alignItems={"center"}>
                                    <img src={calendarIcon} alt="calendarIcon" />
                                    <Typography className={classes.dateText}>{moment(task.deadline).fromNow()}</Typography>
                                </Box>
                            </Box>
                    }
                </CardContent>
            </Card>
        </>
    )
}