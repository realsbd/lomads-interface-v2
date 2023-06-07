import React from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { Typography, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { SiNotion } from "react-icons/si";
import { BiLock } from "react-icons/bi";
import { BsDiscord, BsGoogle, BsGithub, BsTwitter, BsGlobe } from "react-icons/bs";

import { useWeb3Auth } from "context/web3Auth";

interface ProjectLinkCardProps {
    link: any,
    key: number,
}

const useStyles = makeStyles((theme: any) => ({
    linkChip: {
        width: 'fit-content !important',
        height: '40px',
        padding: '0 6px !important',
        borderRadius: '100px !important',
        marginRight: '10px !important',
        marginBottom: '10px !important',
        cursor: 'pointer !important',
        '&:hover': {
            boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important'
        }
    },
    lockCircle: {
        height: '30px',
        width: '30px',
        borderRadius: '50% !important',
        background: '#B12F15',
        cursor: 'pointer !important'
    },
}));

export default ({ link, key }: ProjectLinkCardProps) => {
    const classes = useStyles();
    const { account } = useWeb3Auth();

    const handleParseUrl = (url: string, accessControl: boolean, locked: any) => {
        try {
            const link = new URL(url);
            if (link.hostname.indexOf('notion.') > -1) {
                return <SiNotion color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('discord.') > -1) {
                return <BsDiscord color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('github.') > -1) {
                return <BsGithub color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('google.') > -1) {
                return <BsGoogle color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('twitter.') > -1) {
                return <BsTwitter color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else {
                return <span><BsGlobe color={accessControl ? '#FFF' : '#B12F15'} size={20} /></span>
            }
        }
        catch (e) {
            console.error(e);
            return null
        }
    }

    return (
        <Box
            key={key}
            className={classes.linkChip}
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={link.accessControl && _get(link, 'unlocked', []).map((a: any) => a.toLowerCase()).indexOf(account.toLowerCase()) == -1 ? { background: '#C94B32' } : { background: '#FFFFFF' }}
            onClick={() => {
                if (!link.accessControl) {
                    window.open(link.link, '_blank')
                }
                else {
                    console.log("unlock link");
                    // unlock(link);
                }
            }}
        >
            <Box sx={{ height: 30, width: 30 }} display="flex" alignItems={"center"} justifyContent={"center"}>
                {handleParseUrl(link.link, link.accessControl, _get(link, 'unlocked', []).map((a: any) => a.toLowerCase()).indexOf(account.toLowerCase()) == -1)}
            </Box>
            <Typography
                sx={link.accessControl && _get(link, 'unlocked', []).map((a: any) => a.toLowerCase()).indexOf(account.toLowerCase()) == -1 ? { margin: '0 15px', color: '#FFF' } : { margin: '0 15px', color: '#B12F15' }}
            >
                {link.title.length > 25 ? link.title.slice(0, 25) + "..." : link.title}
            </Typography>
            {
                link.accessControl && <Box display="flex" alignItems={"center"} justifyContent={"center"} className={classes.lockCircle}><BiLock color="#FFF" /></Box>
            }
        </Box>
    )
}