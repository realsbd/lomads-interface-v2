import React, { useState, useEffect, useMemo } from "react";
import { find as _find, get as _get, debounce as _debounce, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';

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

import { useDAO } from "context/dao";
import { useWeb3Auth } from "context/web3Auth";

import useTerminology from 'hooks/useTerminology';

import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsTwitter, BsGlobe } from "react-icons/bs";

import moment from 'moment';

import { DEFAULT_ROLES } from "constants/terminology";

import { useAppDispatch } from "helpers/useAppDispatch";
import { createProjectAction } from "store/actions/project";
import { useAppSelector } from "helpers/useAppSelector";

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
    },
    arrayRow: {
        height: '50px',
        width: '100%',
        background: 'rgba(118, 128, 141, 0.05) !important',
        boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1) !important',
        borderRadius: '5px !important',
        marginBottom: '8px !important',
        padding: '0 15px !important',
        '&:last-child': {
            marginBottom: '0 !important'
        }
    },
    linkName: {
        width: '40% !important',
    },
    linkAddress: {
        width: '60% !important',
    },
    rolePill: {
        width: 200,
        display: "flex !important",
        alignItems: "center !important",
        justifyContent: "flex-start !important"
    }
}));

export default () => {
    const classes = useStyles();

    const { DAO } = useDAO();
    const { account } = useWeb3Auth();
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'));
    console.log("DAO in createProject : ", DAO);

    const dispatch = useAppDispatch();
    // @ts-ignore
    const { createProjectLoading } = useAppSelector(store => store.project);

    const [name, setName] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [next, setNext] = useState<boolean>(false);

    const [showAddMember, setShowAddMember] = useState(false);
    const [memberList, setMemberList] = useState(DAO?.members);
    const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
    const [resourceList, setResourceList] = useState<any[]>([]);
    const [showMore, setShowMore] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [newAddress, setNewAddress] = useState<any[]>([]);

    const [toggle, setToggle] = useState<boolean>(false);
    const [selectType, setSelectType] = useState<string>('Invitation');

    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<any[]>([]);

    const [openResource, setOpenResource] = useState<boolean>(false);
    const [openMilestone, setOpenMilestone] = useState<boolean>(false);
    const [openKRA, setOpenKRA] = useState<boolean>(false);

    const [milestones, setMilestones] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [frequency, setFrequency] = useState('');

    const [compensation, setCompensation] = useState(null);

    useEffect(() => {
        if (DAO)
            setMemberList(DAO.members)
    }, [DAO])

    useEffect(() => {
        const rolesArr = _get(DAO, 'terminologies.roles', DEFAULT_ROLES);
        const discordOb = _get(DAO, 'discord', {});
        let temp: any[] = [];
        if (rolesArr) {
            Object.keys(rolesArr).forEach(function (key, _index) {
                temp.push({
                    lastRole: _index === 3, title: key, value: rolesArr[key].label,
                    roleColor: _index == 0 ? '#92e1a8' :
                        _index == 1 ? '#89b3e5' :
                            _index == 2 ? '#e96447' : '#92e1a8'
                });
            });
        }
        if (discordOb) {
            Object.keys(discordOb).forEach(function (key, _index) {
                const discordChannel = discordOb[key];
                discordChannel.roles.forEach((item: any) => {
                    if (item.name !== '@everyone' && item.name !== 'LomadsTestBot' && item.name !== 'Lomads' && (temp.some((m) => m.title.toLowerCase() === item.id.toLowerCase()) === false)) {
                        temp.push({ title: item.id, value: item.name, roleColor: item?.roleColor });
                    }
                })
            });
        }
        setRoles(temp);
    }, [DAO]);

    const all_roles = useMemo(() => {
        let roles: any[] = [];
        Object.keys(_get(DAO, 'discord', {})).map((server) => {
            const r = DAO.discord[server].roles
            roles = roles.concat(r);
        })
        return roles.filter(r => r.name !== "@everyone" && r.name !== 'Lomads' && r.name !== 'LomadsTestBot');
    }, [DAO.discord])

    useEffect(() => {
        const memberList = DAO?.members;
        if (memberList.length > 0 && selectedMembers.length === 0) {
            for (let i = 0; i < memberList.length; i++) {
                if (memberList[i].member.wallet.toLowerCase() === account.toLowerCase()) {
                    let memberOb: any = {};
                    memberOb.name = memberList[i].member.name;
                    memberOb.address = memberList[i].member.wallet;
                    setSelectedMembers([...selectedMembers, memberOb]);
                }
            }
        }
    }, [DAO]);

    useEffect(() => {
        console.log("new address : ", newAddress);
        if (newAddress.length > 0) {
            newAddress.map((value) => {
                const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === value.toLowerCase());
                let memberOb: any = {};
                memberOb.name = user.member.name;
                memberOb.address = user.member.wallet;
                setSelectedMembers((oldValue) => [...oldValue, memberOb]);
            })
        }
    }, [DAO]);

    const handleParseUrl = (url: string) => {
        try {
            const link = new URL(url);
            if (link.hostname.indexOf('notion.') > -1) {
                return <SiNotion color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('discord.') > -1) {
                return <BsDiscord color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('github.') > -1) {
                return <BsGithub color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('google.') > -1) {
                return <BsGoogle color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('twitter.') > -1) {
                return <BsTwitter color='#76808D' size={20} />
            }
            else {
                return <span><BsGlobe color="#76808D" size={20} /></span>
            }
        }
        catch (e) {
            console.error(e);
            return;
        }
    }

    const handleAddMember = (member: any) => {
        const memberExists = _find(selectedMembers, m => m.address.toLowerCase() === member.wallet.toLowerCase())
        if (memberExists)
            setSelectedMembers(prev => prev.filter((item) => item.address.toLowerCase() !== member.wallet.toLowerCase()));
        else {
            let memberOb: any = {};
            memberOb.name = member.name;
            memberOb.address = member.wallet;
            setSelectedMembers(prev => [...prev, memberOb]);
        }
    }

    const handleAddRoles = (role: any) => {
        const roleExists = _find(selectedRoles, m => m.toLowerCase() === role.toLowerCase())
        if (roleExists)
            setSelectedRoles(prev => prev.filter((item) => item.toLowerCase() !== role.toLowerCase()));
        else {
            setSelectedRoles([...selectedRoles, role]);
        }
    }

    const handleCreateProject = () => {
        let project: any = {};
        project['name'] = name;
        project['description'] = desc;
        project['links'] = resourceList;
        project['milestones'] = milestones;
        project['compensation'] = compensation;
        project['kra'] = {
            frequency,
            results
        };
        project['daoId'] = DAO?._id;

        if (!toggle) {
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                arr.push({ name: user.member.name, address: user.member.wallet })
            }
            project['members'] = arr;
            project['validRoles'] = [];
            project['inviteType'] = 'Open';
        }

        if (toggle && selectType === 'Invitation') {
            project['members'] = _uniqBy(selectedMembers, m => m.address);
            project['validRoles'] = [];
            project['inviteType'] = 'Invitation';
        }

        if (toggle && selectType === 'Roles') {
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                if (user.discordRoles) {
                    let myDiscordRoles: any[] = [];
                    Object.keys(user.discordRoles).forEach(function (key, index) {
                        myDiscordRoles = [...myDiscordRoles, ...user.discordRoles[key]]
                    })
                    let index = selectedRoles.findIndex(item => item.toLowerCase() === user.role.toLowerCase() || myDiscordRoles.indexOf(item) > -1);

                    if (index > -1) {
                        arr.push({ name: user.member.name, address: user.member.wallet })
                    }
                }
                else {
                    if (selectedRoles.includes(user.role)) {
                        arr.push({ name: user.member.name, address: user.member.wallet })
                    }
                }
            }
            project['members'] = _uniqBy(arr, m => m.address);
            project['validRoles'] = selectedRoles;
            project['inviteType'] = 'Roles';
        }

        dispatch(createProjectAction(project));
    }

    const handleRenderMemberList = () => {
        return (
            <Paper className={classes.paperContainer} sx={{ width: 480 }}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '22px' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#76808D' }}>Invite members</Typography>
                    <Button variant="contained" color="secondary" className={classes.addMemberBtn}>ADD NEW MEMBER</Button>
                </Box>
                {
                    _sortBy(memberList, m => _get(m, 'member.name', '').toLowerCase(), 'asc').map((item, index) => {
                        if (item.member.wallet.toLowerCase() !== account.toLowerCase()) {
                            return (
                                <>
                                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} key={index} onClick={() => handleAddMember(item.member)}>
                                        <Avatar name={item.member.name} wallet={item.member.wallet} />
                                        <Checkbox />
                                    </Box>
                                </>
                            )
                        }
                    })
                }
            </Paper>
        )
    }

    const handleRenderRolesList = () => {
        return (
            <Paper className={classes.paperContainer} sx={{ width: 480 }}>
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
                                    <Checkbox />
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
                                    <>
                                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} key={index} onClick={() => handleAddRoles(discord_value.id)}>
                                            <Chip
                                                label={discord_value.name}
                                                className={classes.rolePill}
                                                avatar={<Box sx={{ background: _get(discord_value, 'roleColor', '#99aab5'), borderRadius: '50%' }}></Box>}
                                                sx={{ background: `${_get(discord_value, 'roleColor', '#99aab5')}50` }}
                                            />
                                            <Checkbox />
                                        </Box>
                                    </>
                                )
                            })
                        }
                    </>
                }
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
                                        loading={createProjectLoading}
                                        variant='contained'
                                        disableElevation
                                        sx={{ width: 255, height: 50, fontSize: 16 }}
                                        onClick={handleCreateProject}
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
                    list={resourceList}
                    getResources={(value) => setResourceList(value)}
                    editResources={false}
                />
                <MilestonesModal
                    open={openMilestone}
                    closeModal={() => setOpenMilestone(false)}
                    list={milestones}
                    getCompensation={(value) => setCompensation(value)}
                    getMilestones={(value) => setMilestones(value)}
                    editMilestones={false}
                />
                <KraModal
                    open={openKRA}
                    closeModal={() => setOpenKRA(false)}
                    list={results}
                    freq={frequency}
                    getResults={(value1: any[], value2: string) => { setResults(value1); setFrequency(value2) }}
                    editKRA={false}
                />
                <Grid xs={12} item display="flex" flexDirection="column" alignItems="center" sx={{ margin: '10vh 0' }}>
                    <img src={createProjectSvg} alt="frame-icon" />
                    <Typography color="primary" variant="subtitle1" className={classes.heading}>Project details</Typography>

                    <Paper className={classes.paperContainer} sx={{ width: 453, display: 'flex', flexDirection: 'column' }}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box>
                                <Typography sx={{ fontSize: 22, lineHeight: '25px', marginBottom: '9px' }}>Project resources</Typography>
                                <Typography sx={{ fontSize: 14, lineHeight: '18px', fontStyle: 'italic' }}>Add links for your team to access </Typography>
                            </Box>
                            {
                                resourceList.length > 0
                                    ?
                                    <img src={editToken} alt="hk-logo" onClick={() => setOpenResource(true)} style={{ cursor: 'pointer' }} />
                                    :
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ width: 125, height: 40, fontSize: 16, color: '#C94B32' }}
                                        onClick={() => setOpenResource(true)}
                                    >
                                        <AddIcon sx={{ fontSize: 18 }} /> ADD
                                    </Button>
                            }
                        </Box>
                        {/* Map all the resources */}
                        {
                            resourceList.length > 0 &&
                            <Box>
                                {
                                    resourceList.map((item, index) => {
                                        return (
                                            <Box key={index} className={classes.arrayRow} display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginTop: '20px' }}>
                                                <Box className={classes.linkName} display={"flex"}>
                                                    {handleParseUrl(item.link)}
                                                    <Typography sx={{ marginLeft: '5px' }}>{item.title.length > 10 ? item.title.slice(0, 10) + "..." : item.title}</Typography>
                                                </Box>
                                                <Box className={classes.linkAddress}>
                                                    <Typography>{item.link.length > 20 ? item.link.slice(0, 20) + "..." : item.link}</Typography>
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        }
                    </Paper>

                    <Box className={classes.divider}></Box>

                    <Paper className={classes.paperContainer} sx={{ width: 453, display: 'flex', flexDirection: 'column' }}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box>
                                <Typography sx={{ fontSize: 22, lineHeight: '25px', marginBottom: '9px' }}>Milestones</Typography>
                                <Typography sx={{ fontSize: 14, lineHeight: '18px', fontStyle: 'italic' }}>Add links for your team to access </Typography>
                            </Box>
                            {
                                milestones.length > 0
                                    ?
                                    <img src={editToken} alt="hk-logo" onClick={() => setOpenMilestone(true)} style={{ cursor: 'pointer' }} />
                                    :
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ width: 125, height: 40, fontSize: 16, color: '#C94B32' }}
                                        onClick={() => setOpenMilestone(true)}
                                    >
                                        <AddIcon sx={{ fontSize: 18 }} /> ADD
                                    </Button>
                            }
                        </Box>
                        {/* Map all the milestones */}
                        {
                            milestones.length > 0 &&
                            <Box>
                                {
                                    milestones.map((item, index) => {
                                        return (
                                            <Box key={index} className={classes.arrayRow} display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginTop: '20px' }}>
                                                <Box display={"flex"} alignItems={"center"}>
                                                    <Typography sx={{ fontWeight: '700', fontSize: '14px', color: '#C94B32' }}>{index + 1}</Typography>
                                                    <Typography sx={{ fontWeight: '700', fontSize: '14px', color: '#76808D', marginLeft: '5px' }}>{item.name}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontWeight: '700', fontSize: '14px', color: '#76808D' }}>{moment(item.deadline).format('L')}</Typography>
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        }
                    </Paper>

                    <Box className={classes.divider}></Box>

                    <Paper className={classes.paperContainer} sx={{ width: 453, display: 'flex', flexDirection: 'column' }}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box>
                                <Typography sx={{ fontSize: 22, lineHeight: '25px', marginBottom: '9px' }}>Key results</Typography>
                                <Typography sx={{ fontSize: 14, lineHeight: '18px', fontStyle: 'italic' }}>Set objective for your team</Typography>
                            </Box>
                            {
                                results.length > 0
                                    ?
                                    <img src={editToken} alt="hk-logo" onClick={() => setOpenKRA(true)} style={{ cursor: 'pointer' }} />
                                    :
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ width: 125, height: 40, fontSize: 16, color: '#C94B32' }}
                                        onClick={() => setOpenKRA(true)}
                                    >
                                        <AddIcon sx={{ fontSize: 18 }} /> ADD
                                    </Button>
                            }
                        </Box>
                        {/* Map all the results */}
                        {
                            results.length > 0 &&
                            <Box>
                                {
                                    results.map((item, index) => {
                                        return (
                                            <Box key={index} className={classes.arrayRow} display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginTop: '20px' }}>
                                                <Box display={"flex"} alignItems={"center"}>
                                                    <Typography sx={{ fontWeight: '700', fontSize: '14px', color: '#76808D' }}>{item.name}</Typography>
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        }
                    </Paper>
                    <Button
                        loading={createProjectLoading}
                        variant='contained'
                        disableElevation
                        sx={{ width: 255, height: 50, fontSize: 16, marginTop: '35px' }}
                        onClick={handleCreateProject}
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