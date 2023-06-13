import React, { useState, useEffect } from "react";
import { get as _get, find as _find, groupBy as _groupBy, orderBy as _orderBy } from 'lodash';
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

import Button from "components/Button";
import IconButton from 'components/IconButton';

import archiveIcon from 'assets/svg/archiveIcon.svg';
import AddIcon from '@mui/icons-material/Add';
import expandIcon from 'assets/svg/expand.svg';

import { useNavigate, useParams } from "react-router-dom"
import ProjectCard from "components/ProjectCard";
import { useDAO } from "context/dao";
import { useWeb3Auth } from 'context/web3Auth';

import useRole from 'hooks/useRole';
import useTerminology from 'hooks/useTerminology';

import moment from 'moment';

const useStyles = makeStyles((theme: any) => ({
    createBtn: {
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
    const navigate = useNavigate();
    const { daoURL } = useParams();
    const { DAO } = useDAO();
    const { account } = useWeb3Auth();

    const [value, setValue] = useState<number>(0);
    const [myProjects, setMyProjects] = useState<any[]>([]);
    const [otherProjects, setOtherProjects] = useState<any[]>([]);
    const [initialCheck, setInitialCheck] = useState<boolean>(false);
    const { myRole, can } = useRole(DAO, account, undefined)
    const { transformWorkspace } = useTerminology(_get(DAO, 'terminologies', null))

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const notificationCount = (project: any) => {
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
        return count.length;
    }

    useEffect(() => {
        if (DAO && DAO.url === daoURL) {
            let myProjects = _get(DAO, 'projects', []).filter((project:any) => !project.deletedAt && !project.archivedAt && _find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase()));
            myProjects = myProjects.map((p:any) => {
                let prj = { ...p, notification: 0 }
                if (notificationCount(prj) > 0)
                    prj.notification = 1
                return prj;
            })
            setMyProjects(_orderBy(myProjects, ['notification', p => moment(p.createdAt).unix()], ['desc', 'desc']))
            let otherProjects = _get(DAO, 'projects', []).filter((project:any) => !project.deletedAt && !project.archivedAt && !_find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase()))
            otherProjects = otherProjects.map((p:any) => {
                let prj = { ...p, notification: 0 }
                if (notificationCount(prj) > 0)
                    prj.notification = 1
                return prj;
            })
            setOtherProjects(_orderBy(myProjects.concat(otherProjects), p => moment(p.createdAt).unix(), 'desc'))
        }
    }, [DAO, value]);

    useEffect(() => {
        if (!initialCheck) {
            setInitialCheck(true);
            if (myProjects.length > 0) {
                setValue(0);
            }
            else {
                setValue(1);
            }
        }
    }, [myProjects, initialCheck]);

    return (
        <Box sx={{ width: '100%', marginBottom: '20px' }} display="flex" flexDirection={"column"}>
            <Box sx={{ width: '100%', background: '#FFF', padding: '20px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    TabIndicatorProps={{ hidden: true }}
                    sx={{
                        '& button': { color: 'rgba(118, 128, 141,0.5)', marginRight: '10px', textTransform: 'capitalize', fontSize: '22px', fontWeight: '400' },
                        '& button.Mui-selected': { color: 'rgba(118, 128, 141,1)' },
                    }}
                >
                    <Tab label={`My ${transformWorkspace().labelPlural}`} {...a11yProps(0)} />
                    <Tab label={`All ${transformWorkspace().labelPlural}`} {...a11yProps(1)} />
                </Tabs>

                <Box display={"flex"} alignItems={"center"}>
                    <IconButton onClick={() => navigate(`/${DAO.url}/projects`)} sx={{ marginRight: '20px' }}>
                        <img src={expandIcon} alt="archive-icon" />
                    </IconButton>
                    <IconButton sx={{ marginRight: '20px' }}>
                        <img src={archiveIcon} alt="archiveIcon" />
                    </IconButton>
                    <Button size="small" variant="contained" color="secondary" className={classes.createBtn} onClick={() => navigate(`/${DAO.url}/project/create`)}>
                        <AddIcon sx={{ fontSize: 18 }} /> CREATE
                    </Button>
                </Box>
            </Box>

            {/* Tab panel for my workspace */}
            <TabPanel value={value} index={0} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                    {
                        myProjects.length > 0 && myProjects.filter((item, index) => index < 6).map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <Box key={index}>
                                        <ProjectCard
                                            project={item}
                                            daoUrl={DAO?.url}
                                            tab={value}
                                        />
                                    </Box>
                                )
                            }
                            else {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.showAllCard}
                                        onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: value } }) }}
                                    >
                                        <Typography sx={{ color: '#b12f15' }}>SHOW ALL</Typography>
                                    </Box>
                                )
                            }
                        })
                    }
                </Box>
            </TabPanel>

            {/* Tab panel for all workspace */}
            <TabPanel value={value} index={1} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                    {
                        otherProjects.length > 0 && otherProjects.filter((item, index) => index < 6).map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <Box key={index}>
                                        <ProjectCard
                                            project={item}
                                            daoUrl={DAO?.url}
                                            tab={value}
                                        />
                                    </Box>
                                )
                            }
                            else {
                                return (
                                    <Box
                                        key={index}
                                        className={classes.showAllCard}
                                        onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: value } }) }}
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