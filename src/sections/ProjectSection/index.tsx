import React, { useState } from "react";
import { Box, Typography, Tab, Tabs } from "@mui/material";
import { makeStyles } from '@mui/styles';

import Button from "components/Button";
import IconButton from 'components/IconButton';

import archiveIcon from 'assets/svg/archiveIcon.svg';

const useStyles = makeStyles((theme: any) => ({

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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }} display="flex" flexDirection={"column"}>
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
                    <Tab label="My Workspace" {...a11yProps(0)} />
                    <Tab label="Drafts" {...a11yProps(1)} />
                    <Tab label="All Workspace" {...a11yProps(2)} />
                </Tabs>

                <Box display={"flex"} alignItems={"center"}>
                    <Typography sx={{ marginLeft: '14px', fontWeight: 400, color: '#76808D', marginRight: '100px' }}>Review frequency : Daily</Typography>
                    <IconButton sx={{ marginRight: '20px' }}>
                        <img src={archiveIcon} alt="archiveIcon" />
                    </IconButton>
                    <Button size="small" variant="contained">
                        + CREATE
                    </Button>
                </Box>
            </Box>

            {/* Tab panel for my workspace */}
            <TabPanel value={value} index={0} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>

                </Box>
            </TabPanel>

            {/* Tab panel for drafts */}
            <TabPanel value={value} index={1} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>

                </Box>
            </TabPanel>

            {/* Tab panel for all workspace */}
            <TabPanel value={value} index={1} style={{ marginTop: '0.2rem' }}>
                <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px 7px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>

                </Box>
            </TabPanel>
        </Box>
    )
}