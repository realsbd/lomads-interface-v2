import React, { useMemo } from "react"
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Chip from '@mui/material/Chip';

import DiscordSVG from 'assets/svg/discord.svg'
import NotionSVG from 'assets/svg/Notion-logo.svg'
import GithubSVG from 'assets/svg/githubicon.svg'
import TwitterSVG from 'assets/svg/twitter.svg'
import GlobeSVG from 'assets/svg/globe.svg'
import GoogleSVG from 'assets/svg/google.svg'

type ChipType = {
    url: string,
    name: string
}

const useStyles = makeStyles((theme: any) => ({
    root: {
      height: '40px',
      boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
      backgroundColor: '#FFF',
      display: 'flex', 
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 100,
      padding: '12px 15px',
      cursor: 'pointer'
    },
    image: {
        width: 18, 
        height: 18,
        objectFit: 'contain'
    },
    text: {
		fontFamily: 'Inter, sans-serif',
        color: `${theme.palette.primary.dark} !important`,
        fontSize: '14px !important',
        textTransform: 'uppercase',
        fontWeight: '400 !important',
        paddingLeft: '8px !important',
        whiteSpace: 'nowrap',
        clear: 'both',
        display: 'inline-block'
    }
  }));


export default ({
    url,
    name
}: ChipType) => {
    const classes = useStyles();

    const image = useMemo(() => {
        const link = new URL(url);
        if (link.hostname.indexOf('notion.') > -1) {
            return NotionSVG
        }
        else if (link.hostname.indexOf('discord.') > -1) {
            return DiscordSVG
        }
        else if (link.hostname.indexOf('github.') > -1) {
            return GithubSVG
        }
        else if (link.hostname.indexOf('google.') > -1) {
            return GoogleSVG
        }
        else if (link.hostname.indexOf('twitter.') > -1) {
            return TwitterSVG
        }
        else {
            return GlobeSVG
        }
    }, [url])

    return (
     <Box className={classes.root}>
        <img className={classes.image} src={image} />
        <Typography className={classes.text}>{ name }</Typography>
     </Box>
    )
}