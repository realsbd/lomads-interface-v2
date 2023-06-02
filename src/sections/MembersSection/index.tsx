import React, { useState } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { Box, Typography, Chip } from "@mui/material";
import { makeStyles } from '@mui/styles';

import membersGroup from 'assets/svg/membersGroup.svg'

import Button from "components/Button";
import AddIcon from '@mui/icons-material/Add';
import Avatar from "components/Avatar";

import moment from "moment";
import { useDAO } from "context/dao";
import useTerminology from 'hooks/useTerminology';
import InviteMemberModal from "modals/Project/InviteMemberModal";
import editSvg from 'assets/svg/editToken.svg';

const useStyles = makeStyles((theme: any) => ({
    line: {
        border: '1px solid rgba(118, 128, 141, 0.5) !important',
        transform: 'rotate(90deg) !important',
        width: '35px',
        height: '0px',
        marginRight: '28px !important'
    },
    lineSm: {
        border: '1px solid rgba(118, 128, 141, 0.5) !important',
        height: '19px',
        width: '0px'
    },
    addMemberBtn: {
        width: '125px',
        height: '40px',
        background: '#FFFFFF !important',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), - 3px - 3px 8px rgba(201, 75, 50, 0.1) !important',
        borderRadius: '5px !important',
        fontSize: '14px !important',
        color: '#C94B32 !important'
    },
    rolePill: {
        display: "flex !important",
        alignItems: "center !important",
        justifyContent: "flex-start !important",
        marginRight: '10px !important'
    },
}));

interface MembersProps {
    showProjects: boolean;
    list: any[];
}

export default ({ showProjects, list }: MembersProps) => {
    const classes = useStyles();
    const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
    const { DAO } = useDAO();
    const { transformRole } = useTerminology(_get(DAO, 'terminologies'))

    const handleRenderRole = (item: any) => {
        const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === item.member.wallet.toLowerCase());
        return transformRole(_get(user, 'role', '')).label
    }

    const NameAndAvatar = (props: any) => {
        const [show, setShow] = useState(false);
        let roles: any = [];
        const discordOb = _get(DAO, 'discord', null);
        const user = props.user;
        const index = props.index;
        if (user.discordId && discordOb) {
            Object.keys(discordOb).forEach(function (key, _index) {
                const discordChannel = discordOb[key];
                let person = _find(_get(discordChannel, 'members', []), m => _get(m, 'displayName', '').toLowerCase() === user.discordId.toLowerCase());
                if (person) {
                    person.roles.forEach(function (item: any) {
                        _get(discordChannel, 'roles', []).map((i: any) => {
                            if (i.id === item && i.name !== '@everyone') {
                                roles.push({ name: i.name, roleColor: _get(i, 'roleColor', '#99aab5') })
                            }
                        })
                    })
                }
            });
        }

        return (
            <>
                <Box sx={{ width: '100%', marginBottom: '25px', zIndex: props.highlightMembers ? 1400 : 0 }} display={"flex"} alignItems={"center"} key={index} id="members">
                    <Box sx={{ width: '250px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Avatar name={user.name} wallet={user.wallet} />
                        <Box className={classes.lineSm}></Box>
                    </Box>
                    <Box sx={{ width: '300px' }} display={"flex"} alignItems={"center"}>
                        <Box sx={{ width: '150px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Typography sx={{ marginLeft: '6px', fontSize: '14px', color: '#76808D' }}>{moment.utc(user.joined).local().format('MM/DD/YYYY')}</Typography>
                            <Box className={classes.lineSm}></Box>
                        </Box>
                        <Box sx={{ width: '150px', marginLeft: '10px' }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: '700', color: '#76808D' }}>{handleRenderRole(user)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: '300px' }} display={"flex"} alignItems={"center"}>
                        <Chip
                            label={'Senior marketing'}
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
                        <Chip
                            label={'Developer'}
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
                    </Box>
                </Box>
            </>
        );
    };

    return (
        <Box sx={{ width: '100%', marginBottom: '20px' }} display="flex" flexDirection={"column"}>

            <InviteMemberModal
                open={openInviteModal}
                closeModal={() => setOpenInviteModal(false)}
            />

            <Box sx={{ width: '100%', background: '#FFF', padding: '20px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Typography sx={{ fontSize: '22px', fontWeight: '400', color: '#76808D' }}>Members</Typography>
                <Box display={"flex"} alignItems={"center"}>
                    <img src={membersGroup} alt="membersGroup" />
                    <Typography sx={{ marginLeft: '15px', fontSize: '16px' }}>{list.length} members</Typography>
                    <Box sx={{ cursor: 'pointer', margin: '0 20px' }}>
                        <img src={editSvg} alt="edit-svg" style={{ height: '40px', width: '40px' }} />
                    </Box>
                    <Button size="small" variant="contained" color="secondary" className={classes.addMemberBtn} onClick={() => setOpenInviteModal(true)}>
                        <AddIcon sx={{ fontSize: 18 }} /> MEMBER
                    </Button>
                </Box>
            </Box>

            <Box sx={{ width: '100%', background: '#FFF', padding: '26px 22px', borderRadius: '5px', marginTop: '0.2rem' }} display={"flex"} flexDirection={"column"}>

                <Box sx={{ width: '100%', marginBottom: '25px' }} display={"flex"} alignItems={"center"}>
                    <Box sx={{ width: '250px' }}>
                        <Typography sx={{ fontSize: '16px', color: '#76808D', opacity: '0.5' }}>Name</Typography>
                    </Box>
                    <Box sx={{ width: '250px' }}>
                        <Typography sx={{ fontSize: '16px', color: '#76808D', opacity: '0.5', marginLeft: '22px' }}>Joined</Typography>
                    </Box>
                </Box>

                {_sortBy(_uniqBy(list, (m: any) => m.member.wallet.toLowerCase()), (m: any) => _get(m, 'member.name', '').toLowerCase(), 'asc').map((result: any, index: any) => {
                    return (
                        <NameAndAvatar
                            index={index}
                            user={result}
                            name={_get(result, 'member.name', '')}
                            position={index}
                            joined={_get(result, 'joined')}
                            creator={_get(result, 'creator', false)}
                            role={_get(result, 'role', 'role4')}
                            address={_get(result, 'member.wallet', '')}
                        />
                    );
                })}
            </Box>
        </Box>
    )
}