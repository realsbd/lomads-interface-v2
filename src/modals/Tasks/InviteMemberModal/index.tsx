import React, { useState, useMemo, useEffect } from "react";
import { find as _find, get as _get, debounce as _debounce, sortBy as _sortBy } from 'lodash';
import { Typography, Box, Drawer, List, ListItem, } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { useDAO } from "context/dao";
import { useWeb3Auth } from "context/web3Auth";

import Checkbox from "components/Checkbox";
import Button from "components/Button";
import theme from "theme";
import Avatar from "components/Avatar";


const { toChecksumAddress } = require('ethereum-checksum-address')

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
        padding: '27px !important',
    },
    modalTitle: {
        color: '#76808D',
        fontSize: '24px !important',
        fontWeight: '700 !important',
        marginBottom: '20px !important'
    },
}));

interface Props {
    open: boolean;
    closeModal(): any;
    hideBackdrop: boolean;
    selectedApplicants: any;
    reviewer?: any;
    handleInvitations(action: any): void;
}

export default ({ open, closeModal, hideBackdrop, selectedApplicants, reviewer, handleInvitations }: Props) => {
    const classes = useStyles();
    const { DAO } = useDAO();
    const { account } = useWeb3Auth();
    const [selectedMembers, setSelectedMembers] = useState<any[]>(selectedApplicants);

    // useEffect(() => {
    //     if (selectedApplicants.length > 0) {
    //         setSelectedMembers(selectedApplicants);
    //     }
    // }, [])

    const handleAddMember = (member: any) => {
        const memberExists = _find(selectedMembers, m => m.address.toLowerCase() === member.wallet.toLowerCase())
        if (memberExists)
            setSelectedMembers((prev: any) => prev.filter((item: any) => item.address.toLowerCase() !== member.wallet.toLowerCase()));
        else {
            let memberOb: any = {};
            memberOb.name = member.name;
            memberOb.address = member.wallet;
            setSelectedMembers((prev: any) => [...prev, memberOb]);
        }
    }

    console.log("selected applicant : ", selectedMembers)

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            open={open}
            sx={{ zIndex: theme.zIndex.appBar + 1 }}
            hideBackdrop={hideBackdrop}
        >
            <Box className={classes.modalConatiner}>

                <Box display="flex" flexDirection="column" sx={{ width: '100%', marginBottom: '20px' }}>
                    <Typography sx={{ color: '#76808D', fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Invite members</Typography>
                    <List>
                        {
                            _sortBy(_get(DAO, 'members', []).filter((m: any) => (reviewer || "").toLowerCase() !== m.member._id && m.deletedAt === null), m => _get(m, 'member.name', '').toLowerCase(), 'asc').filter((member: any) => toChecksumAddress(member?.member.wallet) !== account).map((item: any, index: number) => {
                                const labelId = `checkbox-list-label-${item.member.wallet}`;
                                return (
                                    <ListItem disablePadding key={item.member.wallet}>
                                        <Box width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"space-between"} onClick={() => handleAddMember(item.member)}>
                                            <Avatar name={_get(item.member, 'name', '')} wallet={_get(item.member, 'wallet', '')} />
                                            <Checkbox
                                                edge="center"
                                                tabIndex={-1}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </Box>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Box>

                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%', marginTop: '20px' }}>
                    <Button variant="outlined" sx={{ marginRight: '20px', width: '169px' }} onClick={closeModal}>CANCEL</Button>
                    <Button
                        variant="contained"
                        sx={{ width: '184px' }}
                        onClick={() => { handleInvitations(selectedMembers); closeModal(); }}
                    >
                        SELECT
                    </Button>
                </Box>

            </Box>
        </Drawer>
    )
}