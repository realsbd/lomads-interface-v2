import React, { useState } from "react";
import { Grid, Paper, Typography, Box, Chip } from "@mui/material";
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';

import createProjectSvg from 'assets/svg/createProject.svg';
import TextInput from 'components/TextInput'
import TextEditor from 'components/TextEditor'
import Button from "components/Button";
import Switch from "components/Switch";

import editToken from 'assets/svg/editToken.svg'
import Checkbox from "components/Checkbox";
import Avatar from "components/Avatar";
import ResourcesModal from "modals/Project/ResourcesModal";
import MilestonesModal from "modals/Project/MilestonesModal";
import Dropdown from "components/Dropdown";
import KraModal from "modals/Project/KraModal";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: "32px !important",
        margin: "20px 0 35px 0 !important"
    },
    paperContainer: {
        borderRadius: 5,
        padding: '26px 22px',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important'
    },
    descriptionCard: {
        width: 404,
        backgroundColor: '#FFF',
        borderRadius: '5px !important',
        display: 'flex',
        justifyContent: 'space-between',
        padding: 22
    },
    projectName: {
        fontWeight: '400 !important',
        fontSize: '22px !important',
        lineHeight: '25px !important',
        letterSpacing: '-0.011em !important',
        color: '#76808d',
        marginBottom: '9px !important'
    },
    projectDesc: {
        fontWeight: '400 !important',
        fontSize: '14px !important',
        lineHeight: '16px !important',
        color: '#1b2b41 !important',
    },
    divider: {
        width: 210,
        border: '2px solid #C94B32',
        margin: '35px 0 !important'
    },
    dropdown: {
        background: 'linear-gradient(180deg, #FBF4F2 0 %, #EEF1F5 100 %) !important',
        borderRadius: '10px',
    },
    addMemberBtn: {
        width: '209px',
        hieght: '40px',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), - 3px - 3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px !important',
        color: '#76808D !important',
        fontSize: '14px !important'
    }
}));

export default () => {
    const classes = useStyles();

    const [name, setName] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [next, setNext] = useState<boolean>(false);
    const [toggle, setToggle] = useState<boolean>(false);
    const [selectType, setSelectType] = useState<string>('Invitation');
    const [showMore, setShowMore] = useState<boolean>(false);

    const [openResource, setOpenResource] = useState<boolean>(false);
    const [openMilestone, setOpenMilestone] = useState<boolean>(false);
    const [openKRA, setOpenKRA] = useState<boolean>(false);

    const handleChange = (option: string) => {
        setSelectType(option)
    }

    const handleRenderMemberList = () => {
        return (
            <Paper className={classes.paperContainer} sx={{ width: 480 }}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '22px' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#76808D' }}>Invite members</Typography>
                    <Button variant="contained" color="secondary" className={classes.addMemberBtn}>ADD NEW MEMBER</Button>
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Avatar name="Zohaib" wallet="0xA015C8B6844Fa3294209f413F32Da90e92c45F5a" />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Avatar name="Zohaib" wallet="0xA015C8B6844Fa3294209f413F32Da90e92c45F5a" />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Avatar name="Zohaib" wallet="0xA015C8B6844Fa3294209f413F32Da90e92c45F5a" />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Avatar name="Zohaib" wallet="0xA015C8B6844Fa3294209f413F32Da90e92c45F5a" />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Avatar name="Zohaib" wallet="0xA015C8B6844Fa3294209f413F32Da90e92c45F5a" />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Avatar name="Zohaib" wallet="0xA015C8B6844Fa3294209f413F32Da90e92c45F5a" />
                    <Checkbox />
                </Box>
            </Paper>
        )
    }

    const handleRenderRolesList = () => {
        return (
            <Paper className={classes.paperContainer} sx={{ width: 480 }}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '22px' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#76808D' }}>Organisation Roles</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Admin"
                        avatar={<Box sx={{ background: 'rgba(146, 225, 168, 1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(146, 225, 168, 0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Core Contributor"
                        avatar={<Box sx={{ background: 'rgba(137,179,229,1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(137,179,229,0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Active Contributor"
                        avatar={<Box sx={{ background: 'rgba(234,100,71,1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(234,100,71,0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Contributor"
                        avatar={<Box sx={{ background: 'rgba(146, 225, 168, 1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(146, 225, 168, 0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ margin: '22px 0' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#76808D' }}>Discord Roles</Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Headmaster"
                        avatar={<Box sx={{ background: 'rgba(146, 225, 168, 1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(146, 225, 168, 0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Teacher"
                        avatar={<Box sx={{ background: 'rgba(137,179,229,1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(137,179,229,0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Studens"
                        avatar={<Box sx={{ background: 'rgba(234,100,71,1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(234,100,71,0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Chip
                        label="Staff"
                        avatar={<Box sx={{ background: 'rgba(146, 225, 168, 1)', borderRadius: '50%' }}></Box>}
                        sx={{ background: 'rgba(146, 225, 168, 0.3)', width: 200, display: "flex", alignItems: "center", justifyContent: "flex-start" }}
                    />
                    <Checkbox />
                </Box>
            </Paper>
        )
    }

    const _renderCreateProject = () => {
        return (
            <Grid container className={classes.root}>
                <Grid xs={12} item display="flex" flexDirection="column" alignItems="center" sx={{ margin: '10vh 0' }}>
                    <img src={createProjectSvg} alt="frame-icon" />
                    <Typography color="primary" variant="subtitle1" className={classes.heading}>Create new Project</Typography>
                    {
                        next
                            ?
                            <Grid container>
                                <Grid item xs={12} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                    <Paper className={classes.descriptionCard} elevation={0}>
                                        <Box>
                                            <Typography className={classes.projectName}>Project Name</Typography>
                                            <Typography className={classes.projectDesc} dangerouslySetInnerHTML={{ __html: desc.length > 50 ? desc.substring(0, 50) + "..." : desc }}></Typography>
                                        </Box>
                                        <Box>
                                            <Box sx={{ cursor: 'pointer' }} onClick={() => setNext(false)}>
                                                <img src={editToken} alt="hk-logo" />
                                            </Box>
                                        </Box>
                                    </Paper>
                                    <Box className={classes.divider}></Box>
                                </Grid>
                                <Grid item xs={12} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Box sx={{ marginRight: '27px' }}><Typography sx={{ color: !toggle ? '#C94B32' : '#76808D' }}>OPEN FOR ALL</Typography></Box>
                                        <Box><Switch checkedSVG="lock" onChange={() => setToggle(!toggle)} /></Box>
                                        <Box sx={{ marginLeft: '-5px' }}><Typography sx={{ color: toggle ? '#C94B32' : '#76808D' }}>FILTER BY</Typography></Box>
                                    </Box>
                                    {
                                        !toggle &&
                                        <Typography sx={{ marginTop: '35px', fontSize: 14, fontStyle: 'italic', fontWeight: 400 }}>Any member can see this workplace</Typography>
                                    }
                                    {
                                        toggle &&
                                        <Box sx={{ width: 300, margin: '35px 0' }}>
                                            <Dropdown
                                                options={['Invitation', 'Roles']}
                                                onChange={(value: any) => setSelectType(value)}
                                            />
                                        </Box>
                                    }

                                    {
                                        toggle && selectType === 'Invitation' && handleRenderMemberList()
                                    }

                                    {
                                        toggle && selectType === 'Roles' && handleRenderRolesList()
                                    }
                                </Grid>
                                <Grid item xs={12} display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ marginTop: '35px' }}>
                                    <Button
                                        variant='contained'
                                        color="secondary"
                                        disableElevation
                                        sx={{ width: 255, height: 50, fontSize: 16, color: '#C94B32', marginRight: '35px' }}
                                        onClick={() => setShowMore(true)}
                                    >
                                        ADD MORE DETAIL
                                    </Button>
                                    <Button
                                        variant='contained'
                                        disableElevation
                                        sx={{ width: 255, height: 50, fontSize: 16 }}
                                    >
                                        CREATE WORKSPACE
                                    </Button>
                                </Grid>
                            </Grid>
                            :
                            <Paper className={classes.paperContainer} sx={{ width: 394 }}>
                                <Box sx={{ marginBottom: '20px' }}>
                                    <TextInput
                                        label="Name of the project"
                                        placeholder="Super project"
                                        fullWidth
                                        value={name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    />
                                </Box>
                                <Box sx={{ marginBottom: '20px' }}>
                                    <TextEditor
                                        fullWidth
                                        height={90}
                                        placeholder="Marketing BtoB"
                                        label="Short description"
                                        value={desc}
                                        onChange={(value: string) => setDesc(value)}
                                    />
                                </Box>
                                <Button
                                    variant='contained'
                                    disabled={name !== '' && desc !== '' ? false : true}
                                    sx={{ width: 350 }}
                                    onClick={() => setNext(true)}
                                >
                                    NEXT
                                </Button>
                            </Paper>
                    }
                </Grid>
            </Grid>
        )
    }

    const _renderAddProjectDetails = () => {
        return (
            <Grid container className={classes.root}>
                <ResourcesModal
                    open={openResource}
                    closeModal={() => setOpenResource(false)}
                />
                <MilestonesModal
                    open={openMilestone}
                    closeModal={() => setOpenMilestone(false)}
                />
                <KraModal
                    open={openKRA}
                    closeModal={() => setOpenKRA(false)}
                />
                <Grid xs={12} item display="flex" flexDirection="column" alignItems="center" sx={{ margin: '10vh 0' }}>
                    <img src={createProjectSvg} alt="frame-icon" />
                    <Typography color="primary" variant="subtitle1" className={classes.heading}>Project details</Typography>
                    <Paper className={classes.paperContainer} sx={{ width: 453, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ fontSize: 22, lineHeight: '25px', marginBottom: '9px' }}>Project resources</Typography>
                            <Typography sx={{ fontSize: 14, lineHeight: '18px', fontStyle: 'italic' }}>Add links for your team to access </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: 125, height: 40, fontSize: 16, color: '#C94B32' }}
                            onClick={() => setOpenResource(true)}
                        >
                            <AddIcon sx={{ fontSize: 18 }} /> ADD
                        </Button>
                    </Paper>
                    <Box className={classes.divider}></Box>
                    <Paper className={classes.paperContainer} sx={{ width: 453, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ fontSize: 22, lineHeight: '25px', marginBottom: '9px' }}>Milestones</Typography>
                            <Typography sx={{ fontSize: 14, lineHeight: '18px', fontStyle: 'italic' }}>Add links for your team to access </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: 125, height: 40, fontSize: 16, color: '#C94B32' }}
                            onClick={() => setOpenMilestone(true)}
                        >
                            <AddIcon sx={{ fontSize: 18 }} /> ADD
                        </Button>
                    </Paper>
                    <Box className={classes.divider}></Box>
                    <Paper className={classes.paperContainer} sx={{ width: 453, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ fontSize: 22, lineHeight: '25px', marginBottom: '9px' }}>Key results</Typography>
                            <Typography sx={{ fontSize: 14, lineHeight: '18px', fontStyle: 'italic' }}>Set objective for your team</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: 125, height: 40, fontSize: 16, color: '#C94B32' }}
                            onClick={() => setOpenKRA(true)}
                        >
                            <AddIcon sx={{ fontSize: 18 }} /> ADD
                        </Button>
                    </Paper>
                    <Button
                        variant='contained'
                        disableElevation
                        sx={{ width: 255, height: 50, fontSize: 16, marginTop: '35px' }}
                    >
                        CREATE WORKSPACE
                    </Button>
                </Grid>
            </Grid>
        )
    }

    if (showMore) {
        return _renderAddProjectDetails();
    }

    return _renderCreateProject();
}