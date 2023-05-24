import { Drawer, Box, Grid, Typography, Stack, Avatar } from "@mui/material"
import LomadsAvatar from "components/Avatar"
import IconButton from "components/IconButton"
import CloseSVG from 'assets/svg/close-new.svg'
import EditSVG from 'assets/svg/edit.svg'
import SafeSVG from 'assets/svg/safe.svg'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from "react"
import { makeStyles } from '@mui/styles';
import Button from "components/Button"
import Skeleton from '@mui/material/Skeleton';
import { useDAO } from "context/dao"
import Accordion from '@mui/material/Accordion';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CHAIN_INFO } from "constants/chainInfo"
import { beautifyHexToken } from "utils"

const useStyles = makeStyles((theme: any) => ({
    root: {

    },
    headerTitle: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '400 !important',
        fontSize: '28px !important',
        lineHeight: '38px',
        color:'#C94B32'
    },
    headerDescription: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        textAlign: 'center',
        fontWeight: '400 !important',
        fontSize: '14px !important',
        lineHeight: '19px !important',
        color: '#1B2B41',
        "& span": {
            fontWeight: '600 !important', 
        }
    },
    addSafeButtonText : {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontSize: '12px !important',
        color: '#C94B32'
    },
    safeItem: {
        height: 64,
        backgroundColor: "#FEF6F4 !important",
        padding: 16
    },
    safeDetails: {
        backgroundColor: "#FEF6F4 !important",
        borderTop: "1px solid #D1D4D9"
    },
    ownerTitle: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '600 !important',
        fontSize: '12px',
        lineHeight: '16px',
        color: '#1B2B41'
    }
  }));


export default ({ onClose }: { onClose: any }) => {
    const classes = useStyles();
    const { DAO } = useDAO();
    const [active, setActive] = useState<any>(null)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <Box style={{ position: 'relative' }}>
            <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={onClose}>
                <img src={CloseSVG} />
            </IconButton>
            <Box sx={{ mt: 0 }} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <img src={SafeSVG} />
                <Typography sx={{ mt: 4 }} className={classes.headerTitle}>Safes</Typography>
                <Typography sx={{ mt: 2 }} className={classes.headerDescription}>Easily customize your multi-sig wallet with a <br/><span>personal name, signatories and voting threshold.</span></Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Button size="small" fullWidth variant="contained" color="secondary"><Typography color="primary">Add new safe</Typography></Button>
            </Box>
            <Box sx={{ mt: 2 }}>
                {
                    !DAO ?
                    <Stack spacing={1} direction="column">
                        { ['','','','','','','',''].map(s => <Skeleton variant="rectangular" height={64} width={'100%'} />) }
                    </Stack> : 
                    <Stack spacing={1} direction="column">
                        {
                            DAO?.safes?.map((safe: any) => {
                                return (
                                    <Accordion elevation={0} onChange={() => setActive((prev: any) => { 
                                        if(prev && prev._id === safe._id) {
                                            return null
                                        }
                                        return safe
                                     })} expanded={active && active?._id === safe?._id}>
                                        <AccordionSummary
                                        expandIcon={<ExpandMoreIcon color="primary" />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                        className={classes.safeItem}
                                        >
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <Avatar sx={{ width: 32, height: 32 }} sizes="" src={CHAIN_INFO[safe?.chainId]?.logoUrl} />
                                                <Box sx={{ ml: 2 }}>
                                                    <Typography style={{ color:"#1B2B41", fontWeight: 600, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>{ safe?.name }</Typography>
                                                    <Typography style={{ color:"#1B2B41", opacity: 0.59, fontWeight: 600, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>{ beautifyHexToken(safe?.address) }</Typography>
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                            <AccordionDetails className={classes.safeDetails}>
                                                <Box sx={{ mb: 1 }}>
                                                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                                                        <Typography className={classes.ownerTitle}>{ `${safe?.owners?.length} Owners` }</Typography>
                                                        <IconButton>
                                                            <img src={EditSVG} />
                                                        </IconButton>
                                                    </Box>
                                                    <Box style={{ maxHeight: 250, overflow: 'hidden', overflowY: 'auto' }}>
                                                        {
                                                            safe?.owners?.map((owner:any) => (
                                                            <Box sx={{ my: 2 }}>
                                                                <LomadsAvatar name={owner.name} wallet={owner.wallet}/>
                                                            </Box>
                                                            ))
                                                        }
                                                    </Box>
                                                </Box>
                                                <Box sx={{ width: 190, border: "2px solid #C94B32" }} ></Box>
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography style={{ fontSize: '12px', fontStyle: 'italic', fontWeight: 400 }}>Any transaction requires the confirmation of</Typography>
                                                    <Stack sx={{ mt: 2 }} direction="row" alignItems="center">
                                                        <Box onClick={handleClick} sx={{ p:2, cursor: 'pointer', width: 112, height: 40, borderRadius: '10px', backgroundColor: "#FFF" }} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                                                            <Box>2</Box>
                                                            <ArrowDropDownIcon/>
                                                        </Box>
                                                        <Typography style={{ marginLeft: 16, fontSize: '12px', fontStyle: 'italic', fontWeight: 400 }}>{ `of ${safe?.owners?.length} Owners` }</Typography>
                                                    </Stack>
                                                </Box>
                                                <Menu
                                                    sx={{ zIndex: 99999 + 1 }}
                                                    id="demo-positioned-menu"
                                                    aria-labelledby="demo-positioned-button"
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <MenuItem>Profile</MenuItem>
                                                    <MenuItem>Profile</MenuItem>
                                                    <MenuItem>Profile</MenuItem>
                                                </Menu>
                                            </AccordionDetails>
                                    </Accordion>
                                )
                            })
                        }
                    </Stack>

                }
            </Box>
        </Box>
    )
}