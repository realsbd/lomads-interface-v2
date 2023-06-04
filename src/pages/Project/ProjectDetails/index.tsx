
import React, { useState, useEffect } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { Grid, Typography, Box, Tab, Tabs, Menu, MenuItem } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { IoIosArrowBack } from 'react-icons/io';

import copyIcon from "assets/svg/copyIcon.svg";

import {
    TelegramIcon,
    TwitterIcon,
    WhatsappIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";

import settingIcon from 'assets/svg/settings.svg';
import shareIcon from 'assets/svg/share.svg';
import archiveIcon from 'assets/svg/archiveIcon.svg';
import createProjectSvg from 'assets/svg/createProject.svg';
import StepperProgress from "components/StepperProgress";
import MilestoneCard from "components/MilestoneCard";
import KraCard from "components/KraCard";
import IconButton from 'components/IconButton';
import ProjectLinkCard from "components/ProjectLinkCard";
import ProjectEditModal from "modals/Project/ProjectEditModal";
import AssignContributionModal from "modals/Project/AssignContributionModal";
import Button from "components/Button";
import KraReviewModal from "modals/Project/KraReviewModal";
import TaskSection from "sections/TaskSection";

import { useAppDispatch } from "helpers/useAppDispatch";
import { useAppSelector } from "helpers/useAppSelector";
import useTerminology from 'hooks/useTerminology';
import useRole from "hooks/useRole";
import { useWeb3Auth } from "context/web3Auth";
import { useDAO } from "context/dao";

import { useNavigate, useParams } from "react-router-dom"
import { getProjectAction } from "store/actions/project";
import FullScreenLoader from "components/FullScreenLoader";
import MembersSection from "sections/MembersSection";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    arrowContainer: {
        width: '5% !important',
        height: '100% !important',
        borderRadius: '5px !important',
        marginRight: '0.2rem !important',
        background: '#FFF !important',
        cursor: 'pointer !important'
    },
    nameContainer: {
        width: '95% !important',
        height: '100% !important',
        borderRadius: '5px !important',
        background: '#FFF !important',
        padding: '0 22px !important'
    },
    nameText: {
        fontSize: '30px !important',
        lineHeight: '33px !important',
        color: '#76808D'
    },
    iconContainer: {
        height: '40px',
        width: '40px',
        background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%) !important',
        borderRadius: '5px !important',
        cursor: 'pointer !important'
    },
    descriptionContainer: {
        width: '100%',
        marginBottom: '20px !important',
        padding: '25px 30px !important',
        background: 'rgba(118, 128, 141, 0.05) !important',
        borderRadius: '5px !important',
    },
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
    const dispatch = useAppDispatch();
    const { projectId, daoURL } = useParams();
    const navigate = useNavigate();
    // @ts-ignore
    const { setProjectLoading, Project } = useAppSelector(store => store.project);
    console.log("Project : ", Project);
    console.log("setProjectLoading : ", setProjectLoading);
    const { DAO } = useDAO();
    const { provider, account, chainId } = useWeb3Auth();
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'));
    const { myRole, can } = useRole(DAO, account);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [value, setValue] = useState<number>(0);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [openAssignContribution, setOpenAssignContribution] = useState<boolean>(false);
    const [openKraReview, setOpenKraReview] = useState<boolean>(false);

    const [selectedMilestone, setSelectedMilestone] = useState(null);

    useEffect(() => {
        if (projectId && (!Project || (Project && Project._id !== projectId))) {
            dispatch(getProjectAction(projectId));
        }
    }, [projectId])

    useEffect(() => {
        if (Project) {
            if (_get(Project, 'milestones', []).length > 0) {
                setValue(0);
            }
            else if (_get(Project, 'milestones', []).length === 0 && _get(Project, 'kra.results', []).length > 0) {
                setValue(1);
            }
        }
    }, [Project]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const selectMilestone = (item: any, index: number) => {
        if (index === 0) {
            if (!item.complete) {
                let e = { ...item };
                e.pos = index;
                setSelectedMilestone(e);
                setOpenAssignContribution(true);
            }
        }
        else if (index > 0) {
            if (!item.complete && Project.milestones[index - 1].complete) {
                let e = { ...item };
                e.pos = index;
                setSelectedMilestone(e);
                setOpenAssignContribution(true);
            }
        }
    }

    if (!Project || setProjectLoading || (projectId && (Project && Project._id !== projectId))) {
        return (
            <FullScreenLoader />
        )
    }

    return (
        <Grid container className={classes.root}>
            <Grid xs={12} item display="flex" flexDirection="column" sx={{ margin: '107px 0' }}>

                <ProjectEditModal
                    open={showEdit}
                    closeModal={() => setShowEdit(false)}
                />

                <AssignContributionModal
                    open={openAssignContribution}
                    closeModal={() => setOpenAssignContribution(false)}
                />

                <KraReviewModal
                    open={openKraReview}
                    closeModal={() => setOpenKraReview(false)}
                />

                {/* Name */}
                <Box sx={{ width: '100%', height: 74, marginBottom: '20px' }} display="flex" alignItems="center">
                    <Box onClick={() => navigate(-1)} className={classes.arrowContainer} display="flex" alignItems="center" justifyContent={"center"}>
                        <IoIosArrowBack size={20} color="#C94B32" />
                    </Box>
                    <Box className={classes.nameContainer} display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Box display="flex" alignItems="center">
                            <img src={createProjectSvg} alt="project-icon" style={{ marginRight: '18px', width: 50, height: 40, objectFit: 'cover' }} />
                            <Typography className={classes.nameText}>{_get(Project, 'name', '')}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Box
                                className={classes.iconContainer}
                                display="flex"
                                alignItems="center"
                                justifyContent={"center"}
                                sx={{ marginRight: '12px' }}
                                onClick={() => { setShowEdit(true) }}
                            >
                                <img src={settingIcon} alt="setting-icon" />
                            </Box>
                            <Box
                                className={classes.iconContainer}
                                display="flex"
                                alignItems="center"
                                justifyContent={"center"}
                                onClick={handleClick}
                            >
                                <img src={shareIcon} alt="share-icon" style={{ width: 18, height: 18 }} />
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem style={{ marginLeft: 0, height: 40 }}>
                                    <TwitterShareButton style={{ width: '100%' }} url={`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/project/${projectId}/preview`}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <TwitterIcon size={32} />
                                            <div style={{ marginLeft: 16 }}>Twitter</div>
                                        </div>
                                    </TwitterShareButton>
                                </MenuItem>
                                <MenuItem style={{ marginLeft: 0, height: 40 }}>
                                    <TelegramShareButton style={{ width: '100%' }} url={`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/project/${projectId}/preview`}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <TelegramIcon size={32} />
                                            <div style={{ marginLeft: 16 }}>Telegram</div>
                                        </div>
                                    </TelegramShareButton>
                                </MenuItem>
                                <MenuItem style={{ marginLeft: 0, height: 40 }}>
                                    <WhatsappShareButton style={{ width: '100%' }} url={`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/project/${projectId}/preview`}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <WhatsappIcon size={32} />
                                            <div style={{ marginLeft: 16 }}>Whatsapp</div>
                                        </div>
                                    </WhatsappShareButton>
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/share/${_get(DAO, 'url', '')}/project/${projectId}/preview`)
                                }} style={{ marginLeft: 0, height: 40 }}>
                                    <div style={{}}>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <img style={{ marginLeft: 8 }} src={copyIcon} />
                                            <div style={{ marginLeft: 24 }}>Copy to clipboard</div>
                                        </div>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Box>

                {/* Description */}
                <Box className={classes.descriptionContainer} display="flex" alignItems={"center"}>
                    <Box>
                        <Typography sx={{ fontSize: '22px', lineHeight: '25px', color: '#76808D' }}>Description</Typography>
                    </Box>
                    <Box sx={{ marginLeft: '50px' }}>
                        <Typography
                            dangerouslySetInnerHTML={{ __html: _get(Project, 'description', '') }}
                            sx={{ fontSize: '14px', color: '#1B2B41', margin: 0 }}></Typography>
                    </Box>
                </Box>

                {/* Links */}
                {
                    _get(Project, 'links', []).length > 0 &&
                    <Box display={"flex"} flexWrap={"wrap"} sx={{ width: '100%', marginBottom: '20px' }}>
                        {
                            _get(Project, 'links', []).map((item: any, index: number) => {
                                return (
                                    <ProjectLinkCard key={index} link={item} />
                                )
                            })
                        }
                    </Box>
                }

                {/* Milestones and KRA */}
                {
                    (_get(Project, 'milestones', []).length > 0 || _get(Project, 'kra.results', []).length > 0) &&
                    <Box sx={{ width: '100%', marginBottom: '20px' }} display="flex" flexDirection={"column"}>
                        <Box sx={{ width: '100%', background: '#FFF', padding: '10px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
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
                                {
                                    _get(Project, 'milestones', []).length > 0 && <Tab label="Milestones" {...a11yProps(0)} />
                                }
                                {
                                    _get(Project, 'kra.results', []).length > 0 && <Tab label="Key results" {...a11yProps(1)} />
                                }
                            </Tabs>

                            {
                                value === 0 &&
                                <Box display={"flex"} alignItems={"center"}>
                                    <div style={{ width: '300px' }}>
                                        <StepperProgress variant="secondary" milestones={_get(Project, 'milestones', [])} />
                                    </div>
                                    {
                                        _get(Project, 'milestones', []).length > 0
                                            ?
                                            <Typography sx={{ marginLeft: '16px', fontWeight: 700, color: '#188C7C' }}>
                                                {(((_get(Project, 'milestones', []).filter((item: any) => item.complete === true).length) / (_get(Project, 'milestones', []).length)) * 100).toFixed(2)}%
                                            </Typography>
                                            :
                                            <Typography sx={{ marginLeft: '16px', fontWeight: 700, color: '#188C7C' }}>0%</Typography>
                                    }

                                </Box>
                            }

                            {
                                value === 1 &&
                                <Box display={"flex"} alignItems={"center"}>
                                    <Typography sx={{ marginLeft: '14px', fontWeight: 400, color: '#76808D', marginRight: '100px' }}>Review frequency : {_get(Project, 'kra.frequency', [])}</Typography>
                                    <IconButton sx={{ marginRight: '20px' }}>
                                        <img src={archiveIcon} alt="archiveIcon" />
                                    </IconButton>
                                    <Button size="small" variant="contained" onClick={() => setOpenKraReview(true)}>
                                        REVIEW
                                    </Button>
                                </Box>
                            }
                        </Box>

                        {/* Tab panel for milestones */}
                        <TabPanel value={value} index={0} style={{ marginTop: '0.2rem' }}>
                            <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                                {
                                    _get(Project, 'milestones', []).map((item: any, index: number) => {
                                        return (
                                            <MilestoneCard index={index} milestone={item} openModal={(value1: any, value2: number) => selectMilestone(value1, value2)} />
                                        )
                                    })
                                }
                            </Box>
                        </TabPanel>
                        {/* Tab panel for KRA */}
                        <TabPanel value={value} index={1} style={{ marginTop: '0.2rem' }}>
                            <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                                {
                                    _get(Project, 'kra.results', []).map((item: any, index: number) => {
                                        return (
                                            <KraCard result={item} index={index} />
                                        )
                                    })
                                }
                            </Box>
                        </TabPanel>
                    </Box>
                }

                <TaskSection isHelpIconOpen={false} />

                <MembersSection
                    isHelpIconOpen={false}
                    list={_sortBy(_uniqBy(Project?.members, '_id'), m => _get(m, 'name', '').toLowerCase())}
                    showProjects={true}
                />
            </Grid>
        </Grid>
    )
}