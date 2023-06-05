import React, { useState, useEffect, useMemo } from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";
import TextEditor from 'components/TextEditor'

import CloseSVG from 'assets/svg/closeNew.svg'
import bin from 'assets/svg/bin.svg'
import TASKSVG from 'assets/svg/task.svg'
import { AiOutlinePlus, AiOutlineLock } from "react-icons/ai";
import { IoCloseOutline } from 'react-icons/io5';
import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsTwitter, BsGlobe } from "react-icons/bs";

import { isValidUrl } from 'utils';
import { nanoid } from 'nanoid';

import { useDAO } from "context/dao";

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
    label: {
        fontSize: '16px !important',
        lineHeight: '18px !important',
        color: '#76808d',
        fontWeight: '700 !important',
    },
    addLinkBtn: {
        width: 50,
        height: 50,
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '0 !important',
        marginTop: '10px !important'
    },
    linkArea: {
        width: '100% !important',
        padding: '26px 22px !important',
        background: 'rgba(118, 128, 141, 0.05) !important',
        boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1) !important',
        borderRadius: '5px !important',
        marginTop: '20px !important'
    },
    linkRow: {
        width: '100% !important',
        height: '20px !important',
        marginBottom: '15px !important',
        '&:last-child': {
            marginBottom: '0px !important'
        }
    },
    linkName: {
        width: '40% !important',
    },
    linkAddress: {
        width: '60% !important',
    },
    resourceCard: {
        width: '100%', padding: '10px 20px 20px 20px !important',
        background: '#FFFFFF !important',
        boxShadow: '0px 3px 3px rgba(27, 43, 65, 0.1), -1px -2px 3px rgba(201, 75, 50, 0.05) !important',
        borderRadius: '5px !important',
        marginRight: '10px !important'
    }

}));

interface Props {
    open: boolean;
    hideBackdrop: boolean;
    closeModal(): void;
}

export default ({ open, hideBackdrop, closeModal }: Props) => {
    const classes = useStyles();
    const { DAO } = useDAO();
    const [note, setNote] = useState<string>('');
    const [noteError, setNoteError] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [titleError, setTitleError] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [linkError, setLinkError] = useState<string>('');
    const [resourceList, setResourceList] = useState<any[]>([]);


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

    const handleAddResource = async (status: any = undefined) => {
        if (title === '') {
            setTitleError('Enter title');
            return;
        }
        else if (link === '') {
            setLinkError("Enter link");
            return;
        }
        else if (!isValidUrl(link)) {
            setLinkError("Enter valid link");
            return;
        }
        else {
            let tempLink = link;
            if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                tempLink = 'https://' + tempLink;
            }
            if (link.indexOf('discord.') > -1) {
                let resource: any = {};
                resource.id = nanoid(16);
                resource.title = title;
                resource.link = tempLink;
                resource.provider = new URL(tempLink).hostname;
                let dcserverid = undefined;
                if (status)
                    dcserverid = new URL(tempLink).pathname.split('/')[2]
                resource.platformId = dcserverid;
                if (status)
                    resource.roleId = status;
                setResourceList([...resourceList, resource]);
                setTitle('');
                setLink('');
            }
            else if (link.indexOf('notion.') > -1) {
                if (status.status) {
                    let resource: any = {};
                    resource.id = nanoid(16);
                    resource.title = title;
                    resource.link = tempLink;
                    resource.provider = new URL(tempLink).hostname;
                    setResourceList([...resourceList, resource]);
                    setTitle('');
                    setLink('');
                }
                else {
                    setLinkError(status.message || 'Something went wrong.')
                }
            }
            else {
                let resource: any = {};
                resource.id = nanoid(16);
                resource.title = title;
                resource.link = tempLink;
                resource.accessControl = false
                setResourceList([...resourceList, resource]);
                setTitle('');
                setLink('');
            }
        }
    }

    const handleRemoveResource = (position: number) => {
        setResourceList(resourceList.filter((_, index) => index !== position));
    }

    const handleSubmit = () => {
        closeModal();
    }

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            open={open}
            hideBackdrop={hideBackdrop}
        >
            <Box className={classes.modalConatiner}>
                <Typography sx={{ position: 'fixed', left: 32, top: 32, fontSize: 14, color: '#76808D', fontStyle: 'italic' }}>Task Name</Typography>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={TASKSVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Submit your work</Typography>
                </Box>
                <Box sx={{ margin: '35px 0' }}>
                    <TextEditor
                        fullWidth
                        height={75}
                        width={400}
                        placeholder="I made this change because…"
                        label="Short description"
                        value={note}
                        onChange={(value: string) => { setNote(value); setNoteError('') }}
                        error={noteError !== ''}
                        id={noteError !== '' ? "outlined-error-helper-text" : ""}
                        helperText={noteError}
                    />
                </Box>
                <Box display="flex" flexDirection="column" sx={{ width: '80%' }}>
                    <Typography className={classes.label}>Add links</Typography>
                    <Box display="flex" justifyContent={"space-between"} sx={{ height: '80px' }}>
                        <TextInput
                            sx={{ width: 145 }}
                            placeholder="Ex Portfolio"
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTitle(e.target.value); setTitleError(''); }}
                            error={titleError !== ''}
                            id={titleError !== '' ? "outlined-error-helper-text" : ""}
                            helperText={titleError}
                        />
                        <TextInput
                            sx={{ width: 195 }}
                            placeholder="link"
                            value={link}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setLink(e.target.value); setLinkError(''); }}
                            error={linkError !== ''}
                            id={linkError !== '' ? "outlined-error-helper-text" : ""}
                            helperText={linkError}
                        />

                        <Box
                            className={classes.addLinkBtn}
                            sx={link !== '' && title !== '' ? { background: '#C84A32' } : { background: 'rgba(27, 43, 65, 0.2)', }}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            onClick={() => handleAddResource()}
                        >
                            <AiOutlinePlus color="#FFF" size={25} />
                        </Box>
                    </Box>

                    {
                        resourceList.length > 0 &&
                        <Box className={classes.linkArea}>
                            {
                                resourceList.map((item, index) => {
                                    return (
                                        <Box className={classes.linkRow} display={"flex"} alignItems={"center"} justifyContent={"space-between"} key={index}>
                                            <Box className={classes.linkName} display={"flex"}>
                                                {handleParseUrl(item.link)}
                                                <Typography sx={{ marginLeft: '5px' }}>{item.title.length > 10 ? item.title.slice(0, 10) + "..." : item.title}</Typography>
                                            </Box>
                                            <Box className={classes.linkAddress} display={"flex"} alignItems={"center"}>
                                                <Typography>{item.link.length > 20 ? item.link.slice(0, 20) + "..." : item.link}</Typography>
                                                {item.accessControl && <AiOutlineLock color='#C94B32' />}
                                            </Box>
                                            <Box display={"flex"} alignItems={"center"} justifyContent={"center"}
                                                sx={{ width: 40, cursor: 'pointer' }}
                                                onClick={() => handleRemoveResource(index)}
                                            >
                                                <IoCloseOutline />
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    }

                    {
                        resourceList.length > 0 &&
                        <Box display={"flex"} flexDirection={"column"} sx={{ width: '100%', marginTop: '20px' }}>
                            {
                                resourceList.map((item, index) => {
                                    return (
                                        <Box sx={{ width: '100%' }} display={"flex"} justifyContent={"space-between"} key={index}>
                                            <Box className={classes.resourceCard} display={"flex"}>
                                                <TextInput
                                                    sx={{ marginRight: '10px' }}
                                                    placeholder="Ex Portfolio"
                                                    value={item.title}
                                                />
                                                <TextInput
                                                    // sx={{ width: 195 }}
                                                    placeholder="link"
                                                    value={item.link}
                                                />
                                            </Box>
                                            <IconButton>
                                                <img src={bin} alt="bin" />
                                            </IconButton>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    }

                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%', marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={resourceList.length === 0}
                            sx={{ width: '184px' }}
                        >
                            SEND
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    )
}