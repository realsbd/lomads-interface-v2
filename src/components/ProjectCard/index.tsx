import React, { useMemo } from "react";
import { get as _get, find as _find, groupBy as _groupBy, orderBy as _orderBy } from 'lodash';
import { Typography, Box, Card, CardContent } from "@mui/material";
import { makeStyles } from '@mui/styles';

import submitted from 'assets/svg/submitted.svg';
import calendarIcon from 'assets/svg/calendar.svg'
import { BsDiscord } from 'react-icons/bs';
import { FaTrello, FaGithub } from 'react-icons/fa';

import { useAppDispatch } from "helpers/useAppDispatch";
import { useAppSelector } from "helpers/useAppSelector";
import { useNavigate } from "react-router-dom"
import StepperProgress from "components/StepperProgress";

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
    iconContainer: {
        width: '100%',
        height: '40px',
        padding: '0 10px !important',
        position: 'absolute',
        top: '-20px !important',
        right: '0 !important',
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'flex-end !important',
    },
    iconPill: {
        height: '40px',
        width: '30%',
        padding: '0 10px !important',
        background: '#B12F15 !important',
        boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18) !important',
        borderRadius: '20px !important',
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center!important',
        marginLeft: '10px !important'
    },
}));

interface CardProps {
    project: any;
    daoUrl: string,
    tab: number
}

export default ({ project, daoUrl, tab }: CardProps) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // @ts-ignore
    const { user } = useAppSelector(store => store.session);

    const notifications = useMemo(() => {
        let count = [];
        // @ts-ignore
        let links = project.links.map(l => {
            return { ...l, provider: new URL(l.link).hostname }
        })
        let grp = _groupBy(links, l => l.provider)
        for (let index = 0; index < Object.keys(grp).length; index++) {
            const provider = Object.keys(grp)[index];
            count.push({ provider, count: grp[provider].reduce((p, c) => (p + (+_get(c, 'notification', 0))), 0) })
        }
        console.log(count)
        return count
    }, [project]);

    const handleCardClick = () => {
        console.log("clicked... : ", project.name);
        // dispatch(updateViewProject({ projectId: project._id, daoUrl: _get(DAO, 'url', '') }));
        // navigate(`/${daoUrl}/project/${project._id}`, { state: { project } })
    }

    return (
        <>
            <Card
                className={classes.taskCard}
                sx={{
                    background: '#FFF',
                    boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
                }}
            >
                {
                    project.links.length > 0 && tab === 0
                        ?
                        <Box className={classes.iconContainer}>
                            {
                                notifications.map(notification => {
                                    if (notification.provider.indexOf('discord') > -1 && notification.count) {
                                        return (
                                            <Box className={classes.iconPill}>
                                                <BsDiscord color='#FFF' size={20} />
                                                <p>+{notification.count}</p>
                                            </Box>
                                        )
                                    }
                                })
                            }
                        </Box>
                        :
                        <>
                            {
                                project.provider === 'Trello' && !project.viewers.includes(_get(user, '_id', ''))
                                    ?
                                    <Box className={classes.iconContainer}>
                                        <Box className={classes.iconPill}>
                                            <FaTrello color='#FFF' size={20} />
                                        </Box>
                                    </Box>
                                    :
                                    null
                            }
                            {
                                project.provider === 'Github' && !project.viewers.includes(_get(user, '_id', ''))
                                    ?
                                    <Box className={classes.iconContainer}>
                                        <Box className={classes.iconPill}>
                                            <FaGithub color='#FFF' size={20} />
                                        </Box>
                                    </Box>
                                    :
                                    null
                            }
                        </>
                }

                <CardContent className={classes.taskContent}>
                    <Typography className={classes.taskText}>{_get(project, 'name', '')}</Typography>
                    {
                        _get(project, 'milestones', []).length > 0 &&
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box sx={{ width: '195px' }}>
                                <StepperProgress variant="primary" milestones={_get(project, 'milestones', [])} />
                            </Box>
                            <Typography sx={{ fontSize: '14px', color: '#188c7c', marginLeft: '18px' }}>
                                {(((_get(project, 'milestones', []).filter((item: any) => item.complete === true).length) / (_get(project, 'milestones', []).length)) * 100).toFixed(2)}%
                            </Typography>
                        </Box>
                    }
                </CardContent>
            </Card>
        </>
    )
}