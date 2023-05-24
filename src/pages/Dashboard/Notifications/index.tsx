import clsx from "clsx";
import React, { useEffect, useState} from "react";
import { makeStyles } from '@mui/styles';
import { get as _get } from 'lodash';
import PROJECT_ICON from 'assets/svg/project-icon.svg'
import TASK_ICON from 'assets/svg/taskicon.svg'
import USER_ICON from 'assets/svg/user-icon.svg'
import TRANSACTION_ICON from "assets/svg/sendTokenOutline.svg";
import { useNavigate, useParams } from "react-router-dom";
import axiosHttp from 'api'
import moment from 'moment';
import { beautifyHexToken } from 'utils'
import { useWeb3Auth } from 'context/web3Auth';
import { useAppSelector } from 'helpers/useAppSelector';
import { useAppDispatch } from 'helpers/useAppDispatch';
import { createAccountAction } from 'store/actions/session';
import Skeleton from '@mui/material/Skeleton';
import { useDAO } from 'context/dao';
import { Grid , Box, Typography } from "@mui/material";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '328px !important',
        marginBottom: '20px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    myNotifications: {
        width: '60%',
        borderRadius: '5px',
        backgroundColor: '#f5f0f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
    },
    timelineNotification:{ 
        width: '40%',
        height: '100%',
        borderRadius: '5px'
    },
    listContainer: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '8px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    timelineListContainer: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '21px',
        display: 'flex',
        flexDirection: 'column'
    },
    item: {
        alignItems: 'flex-start',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '3px 5px 20px rgba(27,43,65,.12), 0 0 20px rgba(201,75,50,.18)',
        cursor: 'pointer',
        display: 'flex',
        flex: 'none',
        flexDirection: 'column',
        flexGrow: 0,
        gap: '20px',
        margin: '6px 0',
        order: 0,
        padding: '20px 22px',
        width: '312.98px'
    },
    itemTitle: {
        fontFamily: `'Inter', sans-serif`,
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '16px',
        color: '#76808D',
        marginLeft: '12px',
        flex: 1,
        width: '200px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    itemDate: {
        fontFamily: `'Inter', sans-serif`,
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '25px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'right',
        letterSpacing: '-0.011em',
        color: 'rgba(118, 128, 141, 0.5)'
    },
    content: {
        fontFamily: `'Inter', sans-serif`,
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '22px',
        lineHeight: '25px',
        letterSpacing: '-0.011em',
        color: '#B12F15',
        width: '280px',
        marginTop: '2px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '& .bold': {
            fontWeight: 'bold !important'
        }
    },
    timelineTitle: {
        fontFamily: `'Inter', sans-serif`,
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '18px',
        marginLeft: '8px !important',
        letterSpacing: '-0.011em',
        color: '#76808D',
        maxWidth: '350px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '& .bold': {
            fontWeight: 800
        }
    },
    timelineDate: {
        fontFamily: `'Inter', sans-serif`,
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '18px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'right',
        color: 'rgba(118, 128, 141, 0.5)'
    },
    noContent: {
        height: '100px !important'
    },
    noActionList: {
        width: '80%',
        height: '50px',
        borderRadius: '5px',
        border: '1px dashed rgba(118, 128, 141, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
  }));

export default ({ isHelpIconOpen }: { isHelpIconOpen: any }) => {
    const classes = useStyles();
	const { daoURL } = useParams();
    //@ts-expect-error
    const { user, token } = useAppSelector((state) => state.session);
    const { DAO } = useDAO()
	const { provider, account, chainId } = useWeb3Auth();
    const [myNotifications, setMyNotifications] = useState<Array<any> | null>(null)
    const [timeline, setTimeline] = useState([])
    let navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!DAO)
            setMyNotifications(null)
    }, [DAO])

	useEffect(() => {
		if (token && account && chainId && (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))) {
			dispatch(createAccountAction({ token }))
		}
	}, [account, chainId, user])

    useEffect(() => {
        if(user && DAO && DAO.url === daoURL) {
            axiosHttp.get(`notification?dao=${_get(DAO, '_id', '')}&limit=20`)
            .then(res => {
                setMyNotifications(res.data.data)
            })
            axiosHttp.get(`notification?timeline=1&dao=${_get(DAO, '_id', '')}&limit=10`)
            .then(res => {
                setTimeline(res.data.data)
            })
        }
    }, [DAO, daoURL, user])

    const loadNotification = (notification: any) => {
        if(notification.model === 'Project') {
            if(notification.type === 'project:member.invited' || notification.type === 'project:member.added'){
                if(notification.to && notification.to._id === user._id)
                    return 'You are <span class="bold">invited</span>'
                if(_get(notification, 'to.name', "") && _get(notification, 'to.name', "") !== "")
                    return `${_get(notification, 'to.name', "")} has been <span class="bold">invited</span> to ${ _get(notification, 'project.name', '') }`
                return `${beautifyHexToken(_get(notification, 'to.wallet', ""))} has been <span class="bold">invited </span> to ${ _get(notification, 'project.name', '') }`
            } else if (notification.type === 'project:created') {
                return `${ _get(notification, "project.name", "") } <span class="bold">created</span>`
            } else if (notification.type === 'project:deleted') {
                return `${ _get(notification, "project.name", "") } <span class="bold">deleted</span>`
            } else if (notification.type === 'project:member:removed') {
                return notification.notification
            }
        } else if(notification.model === 'Task') {
            if(notification.type === 'task:member.assigned'){
                if(notification.to._id === user._id)
                    return 'You are <span class="bold">Assigned</span>'
            } else if(notification.type === 'task:member.submission.rejected' || notification.type === 'task:member.submission.approve'){
                if(notification.to && notification.to._id === user._id)
                    return notification.type === 'task:member.submission.rejected' ? 'Submission <span class="bold">rejected</span>' : 'Submission <span class="bold">approved</span>'
            }
            else if(notification.type === 'task:paid'){
                if(notification.to && notification.to._id === user._id)
                    return `Paid for <span class="bold">${notification.title}</span>`
            }
            return notification.notification
        } else {
            return notification.notification
        }
    }

    const navigateTo = (notification: any) => {
        if(notification.model === 'Project') {
            if(!_get(notification, 'project.deletedAt', null) && !_get(notification, 'project.archivedAt', null)) {
                navigate(`/${DAO.url}/project/${_get(notification, 'project._id', '')}`)
            }
        } else if(notification.model === 'Task') {
            if(!_get(notification, 'task.deletedAt', null) && !_get(notification, 'task.archivedAt', null)) {
                navigate(`/${DAO.url}/task/${_get(notification, 'task._id', '')}`)
            }
        }
    }

    const getIcon = (notification: any, userIcon:boolean = true) => {
        if(notification.model === 'Task'){
            if(notification.type.indexOf('member') > -1 && userIcon)
                return USER_ICON
            return TASK_ICON
        }  else if(notification.model === 'Project'){
            if(notification.type.indexOf('member') > -1 && userIcon)
                return USER_ICON
            return PROJECT_ICON
        }  else if(notification.model === 'Transaction'){
            return TRANSACTION_ICON
        } else {
            if(userIcon)
                return USER_ICON
        }
        return undefined
    }

    if(!DAO || !myNotifications) {
        return (
            <Box className={classes.root}>
                <Skeleton variant="rectangular" height={328} width={'59.8%'} className={clsx([classes.myNotifications])} />
                <Skeleton variant="rectangular" height={328} width={'39.8%'} className={clsx([classes.timelineNotification, { marginleft: '5px !important' }])} />
            </Box>
        )
    }

    if(myNotifications && myNotifications.length == 0){
        return (
            <Box className={clsx([classes.root, classes.noContent])}>
                <Box className={classes.myNotifications}>
                    <Box className={classes.listContainer} style={{ justifyContent:'center' }}>
                        <Box className={classes.noActionList}>
                            <span>NO ACTION NOTIFICATION YET</span>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.timelineNotification}>
                    <Box className={classes.timelineListContainer}>
                        <Box sx={{ padding: '18px 0px', cursor: 'pointer' }}>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Box display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
                                    <img className='icon'></img>
                                    <Typography className={classes.timelineTitle}>{ DAO?.name }</Typography>
                                </Box>
                                <Typography className={classes.timelineDate}>{ moment.utc(DAO?.createdAt).local().format('MM/DD') }</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    } 

    return (
        <Box  className={classes.root}>
            <Box className={classes.myNotifications} style={isHelpIconOpen ? {overflow: 'hidden'} : {}}>
                {isHelpIconOpen && <div className="help-card">
                    Find important personnal notifications here.
				</div>}
                <Box className={classes.listContainer}>
                    {
                        myNotifications.map((notification:any) => {
                            return (
                                <Box onClick={() => navigateTo(notification)} key={notification._id} className={classes.item}>
                                    <Box>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <img className='icon' src={getIcon(notification, false)} ></img>
                                            <Typography className={classes.itemTitle}>{ _get(notification, 'title', '') }</Typography>
                                            <Typography className={classes.itemDate}>{ moment.utc(notification?.createdAt).local().format('MM/DD') }</Typography>
                                        </Box>
                                        <Box className={classes.content} dangerouslySetInnerHTML={{ __html: loadNotification(notification) }}></Box>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
            <Box className={classes.timelineNotification}>
                <Box className={classes.timelineListContainer}>
                    {
                        timeline.map((notification: any) => {
                            return (
                                <>
                                    <Box onClick={() => navigateTo(notification)} key={notification._id} sx={{ padding: '18px 0px', cursor: 'pointer' }}>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <Box display="flex" flexDirection="row" alignItems="center" flexGrow={1}>
                                                <img className='icon' src={getIcon(notification)} ></img>
                                                <Typography className={classes.timelineTitle} dangerouslySetInnerHTML={{ __html: loadNotification(notification) }}></Typography>
                                            </Box>
                                            <Typography className={classes.timelineDate}>{ moment.utc(notification.createdAt).local().format('MM/DD') }</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ border: '1px dashed rgba(118, 128, 141, 0.5)' }}></Box>
                                </>
                            )
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}