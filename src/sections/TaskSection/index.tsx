import React, { useState, useEffect } from "react";
import { get as _get, find as _find, orderBy as _orderBy, uniqBy as _uniqBy } from 'lodash';
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

import Button from "components/Button";
import IconButton from 'components/IconButton';
import AddIcon from '@mui/icons-material/Add';

import archiveIcon from 'assets/svg/archiveIcon.svg';
import expandIcon from 'assets/svg/expand.svg';
import CreateTaskModal from "modals/Tasks/CreateTaskModal";
import TaskCard from "components/TaskCard";
import { useDAO } from "context/dao";
import { useWeb3Auth } from "context/web3Auth";
import { useAppSelector } from "helpers/useAppSelector";
import { useAppDispatch } from "helpers/useAppDispatch";
import { useNavigate, useParams } from "react-router-dom";
import moment from 'moment';
import { getProjectAction } from "store/actions/project";

const useStyles = makeStyles((theme: any) => ({
    addMemberBtn: {
        width: '125px',
        height: '40px',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), - 3px - 3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px !important',
        fontSize: '14px !important',
        color: '#C94B32 !important'
    },
    showAllCard: {
        width: '315px',
        height: '110px',
        display: 'flex !important',
        alignItems: 'center !important',
        background: 'linear-gradient(180deg, #fbf4f2, #eef1f5) !important',
        borderRadius: '5px !important',
        cursor: 'pointer !important',
        justifyContent: 'center !important',
        marginBottom: '15px !important',
        marginRight: '20px !important',
        position: 'relative'
    }
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    style?: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, style, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={style}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default () => {
    const classes = useStyles();
    const { projectId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { DAO } = useDAO();
    const { account } = useWeb3Auth();
    //@ts-ignore
    const { user } = useAppSelector(store => store.session);
    // @ts-ignore
    const { Project } = useAppSelector(store => store.project);
    const [value, setValue] = useState<number>(0);
    const [myTasks, setMyTasks] = useState([]);
    const [manageTasks, setManageTasks] = useState([]);
    const [draftTasks, setDraftTasks] = useState([]);
    const [otherTasks, setOtherTasks] = useState([]);

    const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);

    useEffect(() => {
        if (projectId && (!Project || (Project && Project._id !== projectId)))
            dispatch(getProjectAction(projectId));
    }, [projectId])

    useEffect(() => {
        fetchDaoTasks();
    }, [DAO, Project, value, user]);

    const amIEligible = (Task: any) => {
        if (DAO && Task && Task.contributionType === 'open') {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user) {
                if (Task?.validRoles.length > 0) {
                    let myDiscordRoles: any[] = [];
                    const discRoles = _get(user, 'discordRoles', {})
                    Object.keys(discRoles).forEach(key => {
                        myDiscordRoles = [...myDiscordRoles, ...discRoles[key]]
                    })
                    let index = Task?.validRoles.findIndex((item: any) => item.toLowerCase() === user.role.toLowerCase() || myDiscordRoles.indexOf(item) > -1);
                    return index > -1 ? true : false
                } else {
                    return true;
                }
            }
            return true;
        }
        return true;
    };

    const isOthersApproved = (Task: any) => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() !== account?.toLowerCase() && m.status === 'approved')
            if (user)
                return true
            return false
        }
        return false;
    };

    const taskApplicationCount = (task: any) => {
        if (task) {
            if (task.taskStatus === 'open') {
                let applications = _get(task, 'members', []).filter((m: any) => (m.status !== 'rejected' && m.status !== 'submission_rejected'))
                if (applications)
                    return applications.length;
            }
            return 0
        }
        return 0;
    };

    const taskSubmissionCount = (task: any) => {
        if (task) {
            let submissions = _get(task, 'members', [])?.filter((m: any) => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
            if (submissions)
                return submissions.length;
            return 0
        }
        return 0;
    };

    const fetchDaoTasks = () => {
        if (DAO && user) {
            console.log("running fetch tasks .... ")
            const myTasks = _get(DAO, 'tasks', []).filter((task: any) => task.reviewer !== user._id && (!task.deletedAt && !task.archivedAt && !task.draftedAt && amIEligible(task) && ((task.contributionType === 'open' && !task.isSingleContributor) || !isOthersApproved(task)) && (_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || (task.contributionType === 'open' && !task.isSingleContributor))))
            //@ts-ignore
            setMyTasks(_orderBy(myTasks, i => moment(i.deadline).unix(), 'asc'))
            let manageTasks = _get(DAO, 'tasks', []).filter((task: any) => !task.deletedAt && !task.archivedAt && !task.draftedAt && (task.reviewer === user._id));
            manageTasks = manageTasks.map((t: any) => {
                let tsk = { ...t, notification: 0 };
                if (((t.contributionType === 'open' && !t.isSingleContributor) || t.contributionType === 'assign') && taskSubmissionCount(t) > 0) {
                    tsk['notification'] = 1
                } else {
                    if (taskApplicationCount(t) > 0) {
                        tsk['notification'] = 1
                    }
                }
                return tsk
            })
            //@ts-ignore
            setManageTasks(_orderBy(manageTasks, ['notification', i => moment(i.deadline).unix()], ['desc', 'desc']));
            setDraftTasks(_get(DAO, 'tasks', []).filter((task: any) => (!task.deletedAt && !task.archivedAt && task.draftedAt !== null && (task.creator === user._id || task.provider === 'Github' || task.provider === 'Trello'))));
            const otherTasks = _get(DAO, 'tasks', []).filter((task: any) => !_find(myTasks, t => t._id === task._id) && !task.deletedAt && !task.archivedAt && !task.draftedAt && !(task.creator === user._id || task.reviewer === user._id))
            //@ts-ignore
            setOtherTasks(_uniqBy([..._orderBy(otherTasks, i => moment(i.deadline).unix(), 'desc'), ..._orderBy(myTasks.concat(manageTasks), i => moment(i.deadline).unix(), 'desc')], t => t._id));
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    console.log("DAO : ", DAO)

    return (
        <Box sx={{ width: '100%', marginBottom: '20px' }} display="flex" flexDirection={"column"}>
            <CreateTaskModal
                open={openCreateTask}
                closeModal={() => setOpenCreateTask(false)}
            />
            <Box sx={{ width: '100%', background: '#FFF', padding: '20px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    TabIndicatorProps={{
                        hidden: true
                    }}
                    sx={{
                        '& button': { color: 'rgba(118, 128, 141,0.5)', marginRight: '10px', textTransform: 'capitalize', fontSize: '22px', fontWeight: '400' },
                        '& button.Mui-selected': { color: 'rgba(118, 128, 141,1)' },
                    }}
                >
                    <Tab label="My Tasks" {...a11yProps(0)} />
                    <Tab label="Manage" {...a11yProps(1)} />
                    <Tab label="Drafts" {...a11yProps(2)} />
                    <Tab label="All Tasks" {...a11yProps(3)} />
                </Tabs>

                <Box display={"flex"} alignItems={"center"}>
                    <IconButton sx={{ marginRight: '20px' }}>
                        <img src={expandIcon} alt="archive-icon" />
                    </IconButton>
                    <IconButton sx={{ marginRight: '20px' }}>
                        <img src={archiveIcon} alt="archiveIcon" />
                    </IconButton>
                    <Button size="small" variant="contained" color="secondary" className={classes.addMemberBtn} onClick={() => setOpenCreateTask(true)}>
                        <AddIcon sx={{ fontSize: 18 }} /> CREATE
                    </Button>
                </Box>
            </Box>

            {/* Tab panel for my tasks */}
            <TabPanel value={value} index={0} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px', maxHeight: '275px', overflow: 'hidden' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                    {
                        myTasks.map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <Box key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </Box>
                                )
                            }
                            else {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.showAllCard}
                                    // onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}
                                    >
                                        <Typography sx={{ color: '#b12f15' }}>SHOW ALL</Typography>
                                    </Box>
                                )
                            }
                        })
                    }
                </Box>
            </TabPanel>

            {/* Tab panel for manage tasks */}
            <TabPanel value={value} index={1} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px', maxHeight: '275px', overflow: 'hidden' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                    {
                        manageTasks.map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <Box key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </Box>
                                )
                            }
                            else {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.showAllCard}
                                    // onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}
                                    >
                                        <Typography sx={{ color: '#b12f15' }}>SHOW ALL</Typography>
                                    </Box>
                                )
                            }
                        })
                    }
                </Box>
            </TabPanel>

            {/* Tab panel for drafts tasks */}
            <TabPanel value={value} index={2} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px', maxHeight: '275px', overflow: 'hidden' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                    {
                        draftTasks.map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <Box key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </Box>
                                )
                            }
                            else {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.showAllCard}
                                    // onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}
                                    >
                                        <Typography sx={{ color: '#b12f15' }}>SHOW ALL</Typography>
                                    </Box>
                                )
                            }
                        })
                    }
                </Box>
            </TabPanel>

            {/* Tab panel for all tasks */}
            <TabPanel value={value} index={3} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px', maxHeight: '275px', overflow: 'hidden' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                    {
                        otherTasks.map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <Box key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </Box>
                                )
                            }
                            else {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.showAllCard}
                                    // onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}
                                    >
                                        <Typography sx={{ color: '#b12f15' }}>SHOW ALL</Typography>
                                    </Box>
                                )
                            }
                        })
                    }
                </Box>
            </TabPanel>
        </Box>
    )
}