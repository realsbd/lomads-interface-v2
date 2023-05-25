import React, { useState } from "react";
import { Grid, Typography, Box, Tab, Tabs } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { IoIosArrowBack } from 'react-icons/io';

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

    const [value, setValue] = useState<number>(0);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [openAssignContribution, setOpenAssignContribution] = useState<boolean>(false);
    const [openKraReview, setOpenKraReview] = useState<boolean>(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Grid container className={classes.root}>
            <Grid xs={12} item display="flex" flexDirection="column" sx={{ margin: '10vh 0' }}>

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
                    <Box className={classes.arrowContainer} display="flex" alignItems="center" justifyContent={"center"}>
                        <IoIosArrowBack size={20} color="#C94B32" />
                    </Box>
                    <Box className={classes.nameContainer} display="flex" alignItems="center" justifyContent={"space-between"}>
                        <Box display="flex" alignItems="center">
                            <img src={createProjectSvg} alt="project-icon" style={{ marginRight: '18px', width: 50, height: 40, objectFit: 'cover' }} />
                            <Typography className={classes.nameText}>Project Name</Typography>
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
                            >
                                <img src={shareIcon} alt="share-icon" style={{ width: 18, height: 18 }} />
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Description */}
                <Box className={classes.descriptionContainer} display="flex">
                    <Box>
                        <Typography sx={{ fontSize: '22px', lineHeight: '25px', color: '#76808D' }}>Description</Typography>
                    </Box>
                    <Box sx={{ marginLeft: '50px' }}>
                        <Typography sx={{ fontSize: '14px', color: '#1B2B41' }}>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.</Typography>
                    </Box>
                </Box>

                {/* Links */}
                <Box display={"flex"} flexWrap={"wrap"} sx={{ width: '100%', marginBottom: '20px' }}>
                    <ProjectLinkCard isLocked={true} />
                    <ProjectLinkCard isLocked={false} />
                </Box>

                {/* Milestones and KRA */}
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
                            <Tab label="Milestones" {...a11yProps(0)} />
                            <Tab label="Key results" {...a11yProps(1)} />
                        </Tabs>

                        {
                            value === 0 &&
                            <Box display={"flex"} alignItems={"center"}>
                                <div style={{ width: '300px' }}>
                                    <StepperProgress variant="secondary" milestones={[]} />
                                </div>
                                <Typography sx={{ marginLeft: '16px', fontWeight: 700, color: '#188C7C' }}>50%</Typography>
                            </Box>
                        }

                        {
                            value === 1 &&
                            <Box display={"flex"} alignItems={"center"}>
                                <Typography sx={{ marginLeft: '14px', fontWeight: 400, color: '#76808D', marginRight: '100px' }}>Review frequency : Daily</Typography>
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
                            <MilestoneCard isComplete={true} openModal={(value: boolean) => setOpenAssignContribution(value)} />
                            <MilestoneCard isComplete={true} openModal={(value: boolean) => setOpenAssignContribution(value)} />
                            <MilestoneCard isComplete={false} openModal={(value: boolean) => setOpenAssignContribution(value)} />
                        </Box>
                    </TabPanel>
                    {/* Tab panel for KRA */}
                    <TabPanel value={value} index={1} style={{ marginTop: '0.2rem' }}>
                        <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                            <KraCard />
                            <KraCard />
                            <KraCard />
                        </Box>
                    </TabPanel>
                </Box>

                <TaskSection />

            </Grid>
        </Grid>
    )
}