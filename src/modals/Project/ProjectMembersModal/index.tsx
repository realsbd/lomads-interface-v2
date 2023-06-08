import React, { useState, useEffect, useMemo } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
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

import { useAppDispatch } from "helpers/useAppDispatch";
import { useAppSelector } from "helpers/useAppSelector";
import { useDAO } from "context/dao";

import useTerminology from 'hooks/useTerminology';
import { updateProjectMembersAction } from "store/actions/project";
import theme from "theme";

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
    rolePill: {
        width: 200,
        display: "flex !important",
        alignItems: "center !important",
        justifyContent: "flex-start !important"
    }
}));

interface Props {
    open: boolean;
    closeModal(): any;
}

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();

    const dispatch = useAppDispatch();
    // @ts-ignore
    const { Project, updateProjectMembersLoading } = useAppSelector(store => store.project);
    const { DAO } = useDAO();
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'));
    const [updateMembers, setUpdateMembers] = useState(_get(Project, 'members', []).map((_item: any) => { return _item._id }));
    const [toggle, setToggle] = useState(_get(Project, 'inviteType', '') === 'Open' ? false : true);
    const [selectType, setSelectType] = useState(_get(Project, 'inviteType', ''));

    const [selectedRoles, setSelectedRoles] = useState(_get(Project, 'validRoles', []));

    // runs after updating members
    useEffect(() => {
        if (updateProjectMembersLoading === false) {
            closeModal();
        }
    }, [updateProjectMembersLoading]);

    const all_roles = useMemo(() => {
        let roles: any[] = [];
        Object.keys(_get(DAO, 'discord', {})).map((server) => {
            const r = DAO.discord[server].roles
            roles = roles.concat(r);
        })
        return roles.filter(r => r.name !== "@everyone" && r.name !== 'Lomads' && r.name !== 'LomadsTestBot');
    }, [DAO.discord]);

    const handleAddMemberDelete = (userId: any) => {
        if (updateMembers.includes(userId)) {
            setUpdateMembers(updateMembers.filter((m: any) => m !== userId));
        }
        else {
            setUpdateMembers([...updateMembers, userId]);
        }
    }

    const handleAddRoles = (role: any) => {
        const roleExists = _find(selectedRoles, m => m.toLowerCase() === role.toLowerCase())
        if (roleExists)
            setSelectedRoles((prev: any) => prev.filter((item: any) => item.toLowerCase() !== role.toLowerCase()));
        else {
            setSelectedRoles([...selectedRoles, role]);
        }
    }

    const handleEditMembers = () => {

        if (!toggle) {
            console.log("open")
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                arr.push(user.member._id)
            }
            dispatch(updateProjectMembersAction({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: arr, inviteType: 'Open', validRoles: [] } }));
        }

        else if (toggle && selectType === 'Invitation') {
            dispatch(updateProjectMembersAction({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: updateMembers, inviteType: 'Invitation', validRoles: [] } }));
        }

        if (toggle && selectType === 'Roles') {
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                if (user.discordRoles) {
                    let myDiscordRoles: any[] = []
                    Object.keys(user.discordRoles).forEach(function (key, index) {
                        myDiscordRoles = [...myDiscordRoles, ...user.discordRoles[key]]
                    })
                    let index = selectedRoles.findIndex((item: any) => item.toLowerCase() === user.role.toLowerCase() || myDiscordRoles.indexOf(item) > -1);

                    if (index > -1) {
                        arr.push(user.member._id)
                    }
                }
                else {
                    if (selectedRoles.includes(user.role)) {
                        arr.push(user.member._id)
                    }
                }
            }
            dispatch(updateProjectMembersAction({ projectId: _get(Project, '_id', ''), payload: { daoId: _get(DAO, '_id', null), memberList: arr, inviteType: 'Roles', validRoles: selectedRoles } }))
        }

    }

    const handleRenderMemberList = () => {
        return (
            <Paper elevation={0} className={classes.paperContainer} sx={{ width: 480 }}>
                {/* <Box display={"flex"} alignItems={"center"} justifyContent={"flex-end"} sx={{ marginBottom: '22px' }}>
                    <Button size="small" variant="contained" color="secondary" className={classes.addMemberBtn}>+ NEW MEMBER</Button>
                </Box> */}
                {
                    _sortBy(_get(DAO, 'members', []), m => _get(m, 'member.name', '').toLowerCase(), 'asc').map((item: any, index: number) => {
                        return (
                            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} key={index} onClick={() => handleAddMemberDelete(item.member._id)}>
                                <Avatar name={item.member.name} wallet={item.member.wallet} />
                                <Checkbox checked={!(updateMembers.some((m: any) => m === item.member._id) === false)} />
                            </Box>
                        )
                    })
                }
            </Paper>
        )
    }

    const handleRenderRolesList = () => {
        return (
            <Paper elevation={0} className={classes.paperContainer} sx={{ width: 480 }}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '22px' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#76808D' }}>Organisation Roles</Typography>
                </Box>

                {
                    Object.keys(_get(DAO, 'terminologies.roles', {})).map((key, index) => {
                        return (
                            <>
                                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} key={index} onClick={() => handleAddRoles(key)}>
                                    <Chip
                                        label={_get(transformRole(key), 'label')}
                                        className={classes.rolePill}
                                        avatar={
                                            <Box sx={
                                                index === 0 ? { background: 'rgba(146, 225, 168, 1)', borderRadius: '50% !important', } :
                                                    index === 1 ? { background: 'rgba(137,179,229,1)', borderRadius: '50% !important', } :
                                                        index === 2 ? { background: 'rgba(234,100,71,1)', borderRadius: '50% !important', } : { background: 'rgba(146, 225, 168, 1)', borderRadius: '50% !important', }

                                            }></Box>
                                        }
                                        sx={
                                            index === 0 ? { background: 'rgba(146, 225, 168, 0.3)' } :
                                                index === 1 ? { background: 'rgba(137,179,229,0.3)' } :
                                                    index === 2 ? { background: 'rgba(234,100,71,0.3)' } : { background: 'rgba(146, 225, 168, 0.3)' }
                                        }
                                    />
                                    <Checkbox checked={!(selectedRoles.some((m: any) => m.toLowerCase() === key.toLowerCase()) === false)} />
                                </Box>
                            </>
                        )
                    })
                }
                {
                    all_roles && all_roles.length > 0 &&
                    <>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ margin: '22px 0' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#76808D' }}>Discord Roles</Typography>
                        </Box>
                        {
                            all_roles.map((discord_value, index) => {
                                return (
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} key={index} onClick={() => handleAddRoles(discord_value.id)}>
                                        <Chip
                                            label={discord_value.name}
                                            className={classes.rolePill}
                                            avatar={<Box sx={{ background: _get(discord_value, 'roleColor', '#99aab5'), borderRadius: '50%' }}></Box>}
                                            sx={{ background: `${_get(discord_value, 'roleColor', '#99aab5')}50` }}
                                        />
                                        <Checkbox checked={!(selectedRoles.some((m: any) => m.toLowerCase() === discord_value.id.toLowerCase()) === false)} />
                                    </Box>
                                )
                            })
                        }
                    </>
                }
            </Paper>
        )
    }

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            sx={{ zIndex: theme.zIndex.appBar + 1 }}
            open={open}
            hideBackdrop={true}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={createProjectSvg} alt="project-resource" />
                    <Typography className={classes.modalTitle}>{transformWorkspace().label} Members</Typography>
                    <Typography className={classes.modalSubtitle}>Invite the best team or set this {transformWorkspace().label} open so anyone can participate.</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%' }}>

                    <Box display={"flex"} alignItems={"center"}>
                        <Box sx={{ marginRight: '11px' }}><Typography sx={{ color: !toggle ? '#C94B32' : '#76808D' }}>OPEN FOR ALL</Typography></Box>
                        <Box><Switch checked={toggle} checkedSVG="lock" onChange={() => setToggle(!toggle)} /></Box>
                        <Box sx={{ marginLeft: '3px' }}><Typography sx={{ color: toggle ? '#C94B32' : '#76808D' }}>FILTER BY</Typography></Box>
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
                                defaultValue={selectType}
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

                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%', marginTop: '20px' }}>
                        <Button variant="outlined" sx={{ marginRight: '20px', width: '193px' }} onClick={closeModal}>CANCEL</Button>
                        <Button
                            variant="contained"
                            onClick={handleEditMembers}
                            sx={{ width: '184px' }}
                            loading={updateProjectMembersLoading}
                        >
                            ADD
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Drawer>
    )
}