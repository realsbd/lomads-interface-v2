import React, { useState } from "react";

import { Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';

import CloseSVG from 'assets/svg/closeNew.svg'
import settingSvg from 'assets/svg/settingXL.svg';
import editSvg from 'assets/svg/editToken.svg';
import Button from "components/Button";
import CloseProjectModal from "../CloseProjectModal";
import DeleteProjectModal from "../DeleteProjectModal";
import ResourcesModal from "../ResourcesModal";
import MilestonesModal from "../MilestonesModal";
import KraModal from "../KraModal";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: '100vh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        width: 575,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '36px 27px !important',
        background: 'linear-gradient(180deg, #fbf4f2, #eef1f5) !important'
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
    editCard: {
        width: '100%',
        height: '90px !important',
        background: '#FFF !important',
        borderRadius: '5px !important',
        boxShadow: '0px 3px 3px rgba(27, 43, 65, 0.1) !important',
        marginBottom: '20px !important',
        padding: '26px 22px !important'
    },
    editCloseCard: {
        width: '100%',
        background: '#FFF !important',
        borderRadius: '5px !important',
        boxShadow: '0px 3px 3px rgba(27, 43, 65, 0.1) !important',
        marginBottom: '20px !important',
        padding: '26px 22px !important'
    },
    cardTitle: {
        fontSize: '22px !important',
        lineHeight: '25px !important',
        color: '#76808D !important',
    }
}));

interface Props {
    open: boolean;
    closeModal(): any;
}

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();

    const [openCloseModal, setOpenCloseModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    const [openResource, setOpenResource] = useState<boolean>(false);
    const [openMilestone, setOpenMilestone] = useState<boolean>(false);
    const [openKRA, setOpenKRA] = useState<boolean>(false);

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 1 }}
            anchor={'right'}
            open={open}
        >
            <CloseProjectModal
                open={openCloseModal}
                closeModal={() => setOpenCloseModal(false)}
            />

            <DeleteProjectModal
                open={openDeleteModal}
                closeModal={() => setOpenDeleteModal(false)}
            />

            <ResourcesModal
                open={openResource}
                closeModal={() => setOpenResource(false)}
            />

            <MilestonesModal
                open={openMilestone}
                closeModal={() => setOpenMilestone(false)}
            />

            <KraModal
                open={openKRA}
                closeModal={() => setOpenKRA(false)}
            />

            <Box className={classes.modalContainer}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>

                <Box sx={{ width: '100%', padding: '0 27px', marginTop: '60px' }} display={"flex"} flexDirection={"column"}>
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: '35px' }}>
                        <img src={settingSvg} alt="project-resource" />
                        <Typography className={classes.modalTitle}>Project Settings</Typography>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} className={classes.editCard}>
                        <Typography className={classes.cardTitle}>Workspace details</Typography>
                        <Box sx={{ cursor: 'pointer' }}>
                            <img src={editSvg} alt="edit-svg" />
                        </Box>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} className={classes.editCard}>
                        <Typography className={classes.cardTitle}>Workspace members</Typography>
                        <Box sx={{ cursor: 'pointer' }}>
                            <img src={editSvg} alt="edit-svg" />
                        </Box>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} className={classes.editCard}>
                        <Box>
                            <Typography className={classes.cardTitle}>Workspace resources</Typography>
                            <Typography sx={{ fontStyle: 'italic', fontSize: 14 }}>Add links for your team to access</Typography>
                        </Box>
                        <Box onClick={() => setOpenResource(true)} sx={{ cursor: 'pointer' }}>
                            <img src={editSvg} alt="edit-svg" />
                        </Box>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} className={classes.editCard}>
                        <Box>
                            <Typography className={classes.cardTitle}>Milestones</Typography>
                            <Typography sx={{ fontStyle: 'italic', fontSize: 14 }}>Organise link payments to milestones</Typography>
                        </Box>
                        <Box onClick={() => setOpenMilestone(true)} sx={{ cursor: 'pointer' }}>
                            <img src={editSvg} alt="edit-svg" />
                        </Box>
                    </Box>

                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} className={classes.editCard}>
                        <Box>
                            <Typography className={classes.cardTitle}>Key results</Typography>
                            <Typography sx={{ fontStyle: 'italic', fontSize: 14 }}>Set objective for your team</Typography>
                        </Box>
                        <Box onClick={() => setOpenKRA(true)} sx={{ cursor: 'pointer' }}>
                            <img src={editSvg} alt="edit-svg" />
                        </Box>
                    </Box>

                    <Box display={"flex"} flexDirection={"column"} className={classes.editCloseCard}>
                        <Box>
                            <Typography className={classes.cardTitle}>Close Workspace</Typography>
                            <Typography sx={{ fontStyle: 'italic', fontSize: 14 }}>The workspace will appear in archives</Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant='contained'
                            color="secondary"
                            sx={{ height: 40, color: '#C94B32', fontSize: 16, marginTop: '10px' }}
                            onClick={() => setOpenCloseModal(true)}
                        >
                            CLOSE WORKSPACE
                        </Button>
                    </Box>

                    <Box display={"flex"} flexDirection={"column"} className={classes.editCloseCard}>
                        <Box>
                            <Typography className={classes.cardTitle}>Delete Workspace</Typography>
                            <Typography sx={{ fontStyle: 'italic', fontSize: 14 }}>The workspace will not appear in archives</Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant='contained'
                            color="secondary"
                            sx={{ height: 40, fontSize: 16, marginTop: '10px' }}
                            onClick={() => setOpenDeleteModal(true)}
                        >
                            DELETE WORKSPACE
                        </Button>
                    </Box>

                </Box>

            </Box>
        </Drawer>
    )
}