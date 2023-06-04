import React, { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

import Button from "components/Button";
import IconButton from 'components/IconButton';
import AddIcon from '@mui/icons-material/Add';

import archiveIcon from 'assets/svg/archiveIcon.svg';
import expandIcon from 'assets/svg/expand.svg';
import CreateTaskModal from "modals/Tasks/CreateTaskModal";
import TaskCard from "components/TaskCard";

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
    helpCard: {
        position: "relative",
        top: "0",
        left: "0",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        color: "#FFFFFF",
        backgroundColor: "#76808D",
        zIndex: 999,
        width: "100% !important",
        height: "100% !important",
        opacity: 0.8,
        textAlign: "center",
        cursor: "pointer",
        padding: "10px",
        minHeight: 50
    },
    helpCardContent: {
        position: 'absolute',
        fontFamily: "'Inter', sans-serif",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "22px",
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

export default ({isHelpIconOpen}: {isHelpIconOpen: boolean}) => {
    const classes = useStyles();
    const [value, setValue] = useState<number>(0);

    const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', marginBottom: '20px'}} display="flex" flexDirection={"column"}>
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
            <TabPanel value={value} index={0} style={{ marginTop: '0.2rem' }}>
            {
                isHelpIconOpen && 
                        <Box className={classes.helpCard}>
                            <Box className={classes.helpCardContent}>By creating tasks, you can <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> track progress, deadlines, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> rewards on bounties, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> assign contributors </Typography> to each task.</Box>
                        </Box>
            }
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                    {
                        [1, 2, 3, 4, 5, 6].map((item, index) => {
                            return (
                                <TaskCard />
                            )
                        })
                    }
                </Box>
            </TabPanel>

            {/* Tab panel for manage tasks */}
            <TabPanel value={value} index={1} style={{ marginTop: '0.2rem' }}>
            {
                isHelpIconOpen && 
                        <Box className={classes.helpCard}>
                            <Box className={classes.helpCardContent}>By creating tasks, you can <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> track progress, deadlines, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> rewards on bounties, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> assign contributors </Typography> to each task.</Box>
                        </Box>
            }
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>

                </Box>
            </TabPanel>

            {/* Tab panel for drafts tasks */}
            <TabPanel value={value} index={2} style={{ marginTop: '0.2rem' }}>
            {
                isHelpIconOpen && 
                        <Box className={classes.helpCard}>
                            <Box className={classes.helpCardContent}>By creating tasks, you can <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> track progress, deadlines, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> rewards on bounties, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> assign contributors </Typography> to each task.</Box>
                        </Box>
            }
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>

                </Box>
            </TabPanel>

            {/* Tab panel for all tasks */}
            <TabPanel value={value} index={3} style={{ marginTop: '0.2rem' }}>
            {
                isHelpIconOpen && 
                        <Box className={classes.helpCard}>
                            <Box className={classes.helpCardContent}>By creating tasks, you can <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> track progress, deadlines, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> rewards on bounties, </Typography> and <Typography component="span" sx={{ fontWeight: 700, fontSize: 16 }}> assign contributors </Typography> to each task.</Box>
                        </Box>
            }
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>

                </Box>
            </TabPanel>
        </Box>
    )
}