import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme: any) => ({
    taskCard: {
        position: 'relative',
        width: '315px',
        height: '110px',
        padding: '0 !important',
        marginRight: '20px !important',
        marginBottom: '15px !important',
        borderRadius: '5px !important',
        display: 'flex !important',
        cursor: 'pointer',
        zIndex: '999 !important'
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
    proposal: any;
    daoUrl: string;
}

export default ({ proposal, daoUrl }: CardProps) => {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <>
            <Card
                className={classes.taskCard}
                sx={{
                    overflow: 'inherit',
                    background: '#FFF',
                    boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
                }}
            >
                <CardContent className={classes.taskContent}>
                    <Typography className={classes.projectText}>{proposal.space?.name?.length > 20 ? proposal.space?.name?.substring(0, 20) + "..." : proposal.space?.name}</Typography>
                    <Typography className={classes.taskText}>{proposal.title?.length > 20 ? proposal.title?.substring(0, 20) + "..." : proposal.title.name}</Typography>
                </CardContent>
            </Card>
        </>
    )
}