import React, { useState } from "react";

import { Paper, Typography, Box, Chip, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import Switch from "components/Switch";
import Dropdown from "components/Dropdown";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
import Avatar from "components/Avatar";

import CloseSVG from 'assets/svg/closeNew.svg'
import createProjectSvg from 'assets/svg/createProject.svg';

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalConatiner: {
        width: 575,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '27px !important',
        marginTop: '60px !important'
    },
    modalTitle: {
        color: '#C94B32',
        fontSize: '30px !important',
        fontWeight: '400',
        lineHeight: '33px !important',
        marginTop: '20px !important',
        marginBottom: '8px !important'
    },
    modalSubtitle: {
        color: '#76808d',
        fontSize: '14px !important',
        fontStyle: 'italic',
        marginBottom: '35px !important'
    },
    paperContainer: {
        borderRadius: 5,
        padding: '0 22px',
    },
    addMemberBtn: {
        width: '209px',
        hieght: '40px',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), - 3px - 3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px !important',
        fontSize: '14px !important',
        color: '#C94B32 !important'
    },
    divider: {
        width: 210,
        border: '2px solid #C94B32',
        margin: '35px 0 !important'
    },
}));

interface Props {
    open: boolean;
    closeModal(): any;
}

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();
    const [name, setName] = useState<string>('');
    const [desc, setDesc] = useState<string>('');

    const [toggle, setToggle] = useState<boolean>(false);
    const [selectType, setSelectType] = useState<string>('Invitation');

    const handleRenderMemberList = () => {
        return (
            <Paper elevation={0} className={classes.paperContainer} sx={{ width: 480 }}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"flex-end"} sx={{ marginBottom: '22px' }}>
                    <Button size="small" variant="contained" color="secondary" className={classes.addMemberBtn}>+ NEW MEMBER</Button>
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
            <Paper elevation={0} className={classes.paperContainer} sx={{ width: 480 }}>
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

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={createProjectSvg} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Project Members</Typography>
                    <Typography className={classes.modalSubtitle}>Invite the best team or set this Workspace open so anyone can participate.</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%' }}>

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
                        <Box sx={{ width: 300, marginTop: '15px' }}>
                            <Dropdown
                                options={['Invitation', 'Roles']}
                                onChange={(value: any) => setSelectType(value)}
                            />
                        </Box>
                    }

                    {toggle && <Box className={classes.divider}></Box>}

                    {
                        toggle && selectType === 'Invitation' && handleRenderMemberList()
                    }

                    {
                        toggle && selectType === 'Roles' && handleRenderRolesList()
                    }

                </Box>
            </Box>
        </Drawer>
    )
}