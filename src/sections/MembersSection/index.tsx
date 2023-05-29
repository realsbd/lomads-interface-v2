import React, { useState } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { Box, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

import membersGroup from 'assets/svg/membersGroup.svg'

import Button from "components/Button";
import AddIcon from '@mui/icons-material/Add';
import Avatar from "components/Avatar";

import moment from "moment";
import { useDAO } from "context/dao";
import useTerminology from 'hooks/useTerminology';
import InviteMemberModal from "modals/Project/InviteMemberModal";

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
        const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === item.wallet.toLowerCase());
        return transformRole(_get(user, 'role', '')).label
    }

    return (
        <Box sx={{ width: '100%', marginBottom: '20px' }} display="flex" flexDirection={"column"}>

            <InviteMemberModal
                open={openInviteModal}
                closeModal={() => setOpenInviteModal(false)}
            />

            <Box sx={{ width: '100%', background: '#FFF', padding: '20px 22px', borderRadius: '5px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Typography sx={{ fontSize: '22px', fontWeight: '400', color: '#76808D' }}>Members</Typography>
                <Box display={"flex"} alignItems={"center"}>
                    <Box className={classes.line}></Box>
                    <img src={membersGroup} alt="membersGroup" />
                    <Typography sx={{ marginLeft: '15px', marginRight: '63px', fontSize: '16px' }}>{list.length} members</Typography>
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

                {
                    list && list.map((item, index) => {
                        return (
                            <Box sx={{ width: '100%', marginBottom: '25px' }} display={"flex"} alignItems={"center"} key={index}>
                                <Box sx={{ width: '250px' }} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Avatar name={item.name} wallet={item.wallet} />
                                    <Box className={classes.lineSm}></Box>
                                </Box>
                                <Box sx={{ width: '300px' }} display={"flex"} alignItems={"center"}>
                                    <Box display={"flex"} alignItems={"center"}>
                                        <Typography sx={{ marginLeft: '6px', marginRight: '57px', fontSize: '14px', color: '#76808D' }}>{moment.utc(item.joined).local().format('MM/DD/YYYY')}</Typography>
                                        <Box className={classes.lineSm}></Box>
                                    </Box>
                                    <Box sx={{ width: '140px', marginLeft: '10px' }}>
                                        <Typography sx={{ fontSize: '14px', fontWeight: '700', color: '#76808D' }}>{handleRenderRole(item)}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}