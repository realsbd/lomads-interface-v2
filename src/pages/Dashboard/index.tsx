import { Box, Button, Stack } from "@mui/material";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { useDAO } from "context/dao";
import React, { useState, useRef, useEffect } from "react"
import { makeStyles } from '@mui/styles';
import { useNavigate, useParams } from "react-router-dom"
import { Grid } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import WalkThroughPopover from 'components/WalkThroughPopover'
import WalkThroughModal from "components/WalkThroughModal";
import Links from "./Links";
import Notifications from "./Notifications";
import TaskSection from "sections/TaskSection";
import ProjectSection from "sections/ProjectSection";
import MembersSection from "sections/MembersSection";
import { useAppSelector } from "helpers/useAppSelector";
import Treasury from "./Treasury";
import Steps from 'constants/walkthroughsteps';
import questionMarkDark from "assets/svg/question-mark-dark.svg";
import questionMarkLight from "assets/svg/question-mark-light.svg";

type WalkThroughObjType = {
    step: number;
    id: string;
    title: string;
    content: string;
    buttonText: string;
    imgPath: string;
    placement: string;
}

const useStyles = makeStyles((theme: any) => {
     console.log(theme.zIndex.appBar, '...z...')
    return {
    root: {
        display: 'flex',
        background: `linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%)`,
    },
    helpOption: {
        bottom: "44px",
        position: "fixed",
        width: "50px",
        borderRadius: "50%",
        cursor: "pointer !important"
    },
    PlayWalkThroughButton: {
        color: '#C94B32 !important',
        backgroundColor: '#FFFFFF !important',
        cursor: 'pointer',
        position: 'absolute',
        width: '198px !important',
        height: '40px !important',
        borderRadius: '5px !important',
        padding: '0px !important',
        fontFamily: "Inter, sans-serif",
        fontSize: '16px !important',
        '&:hover': {
            backgroundColor: '#FFFFFF !important',
        },
    },
    HideHelpIconButton: {
        color: '#ffffff !important',
        backgroundColor: '#1B2B41 !important',
        cursor: 'pointer',
        width: '198px !important',
        height: '40px !important',
        borderRadius: '5px !important',
        padding: '0px !important',
        fontFamily: "Inter, sans-serif",
        fontSize: '16px !important',
        '&:hover': {
            backgroundColor: '#1B2B41 !important',
        },
    },
    zIndex1k: {
        zIndex: 2000
    },
    walkThroughOverlay: {
        width: "100vw",
        height: "100vh",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        position: "fixed",
        zIndex: theme.zIndex.appBar + 1,
        background: '#1B2B41',
        opacity: 0.2
    }
}});

export default () => {
    const { daoURL } = useParams();
    const navigate = useNavigate();
    const { DAO, DAOList } = useDAO();
    const classes = useStyles();
    const [currWalkThroughObj, setWalkThroughObj] = useState<any>(Steps('')[0]);
    const [showWalkThrough, setShowWalkThrough] = useState<boolean>(true);
    const [isHelpIconOpen, setIsHelpIconOpen] = useState<boolean>(false);
    const anchorRef = useRef<any>();
    const questionMarkRef = useRef<any>();
    // @ts-ignore
    const { setProjectLoading, Project } = useAppSelector(store => store.project);

    const expandHelpOptions = () => {
        setIsHelpIconOpen(!isHelpIconOpen)
    }
    const startWalkThroughAtStepOne = () => {
        setShowWalkThrough(true)
        const workspace = Steps('')[1]
        setWalkThroughObj(workspace)
        setWalkThroughStyles(workspace)
    }

    const getQuestionImage = (): string => {
        return ((showWalkThrough && currWalkThroughObj?.step === 7) || isHelpIconOpen)
            ? questionMarkDark
            : questionMarkLight
    }

    const setWalkThroughStyles = (nextObj: WalkThroughObjType) => {
        console.log(nextObj.id, '....nextObj.id...')
        anchorRef.current = document.getElementById(nextObj.id)
        anchorRef.current.style.zIndex = 2500
        anchorRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'end'
        });
        if (nextObj.step === 6) {
            anchorRef.current.style.boxShadow = '0px 0px 20px rgba(181, 28, 72, 0.6)'
        }
    }

    const clearWalkThroughStyles = () => {
        if (anchorRef.current) {
            anchorRef.current.style = {}
        }
    }
    const incrementWalkThroughSteps = () => {
        console.log(currWalkThroughObj, '....walk thr', Steps(''))
        clearWalkThroughStyles()
        if (currWalkThroughObj?.step === 7) {
            endWalkThrough()
            return
        }

        let nextStep = currWalkThroughObj?.step + 1
        while (showWalkThrough
            && !document.getElementById(Steps('')[nextStep]?.id)
            && nextStep < 7) {
            nextStep++
        }
        const nextObj = Steps('')[nextStep]
        setWalkThroughStyles(nextObj)
        setWalkThroughObj(nextObj)
    }
    const endWalkThrough = () => {
        //dispatch(updateUserOnboardingCount({ payload: { daoId: _get(DAO, '_id', '') } }))
        setShowWalkThrough(false)
        clearWalkThroughStyles()
        setWalkThroughObj(Steps('')[0])
    }


	useEffect(() => {
		function handleClick(event: any) {
			if (isHelpIconOpen && (event.target.matches('div.help-card')
				|| event.target.matches('div.walkThroughOverlay')
				|| event.target.matches('span.bold-text')
				|| event.target.matches('span.help-card-content'))) {
				event.preventDefault()
				setIsHelpIconOpen(false)
			}
		}
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	});

    return (
        <Grid container>
            <Grid item sm={12}>
                <Links />
            </Grid>
            <Grid mt={1} item sm={12}>
                <Notifications isHelpIconOpen={false} />
            </Grid>
            <Grid sm={12}>
                <TaskSection />
            </Grid>
            <Grid sm={12}>
                <ProjectSection />
            </Grid>
            {/* <Grid sm={12}>
                <MembersSection
                    list={_get(DAO, 'members', [])}
                    showProjects={false}
                />
            </Grid> */}
            <Grid mt={1} item sm={12}>
                <Treasury />
            </Grid>
                <Box
                    sx={{ width: '100%', position: 'fixed', left: '33px', bottom: '44px', cursor: 'pointer', zIndex: isHelpIconOpen ? 1300: 1000}}
                    id="question-mark"
                    ref={questionMarkRef}
                    onClick={expandHelpOptions}>
                    {isHelpIconOpen
                        &&
                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                className={classes.PlayWalkThroughButton}
                                onClick={startWalkThroughAtStepOne}>
                                Play walk through
                            </Button>
                            <Button
                                startIcon={<CloseIcon />}
                                className={classes.HideHelpIconButton}
                                onClick={() => questionMarkRef.current.style.display = 'none'}
                                variant="contained">
                                Hide help icon
                            </Button>
                        </Stack>
                    }
                    <img src={getQuestionImage()} />
                </Box>
            {(showWalkThrough || isHelpIconOpen) && <Box className={classes.walkThroughOverlay}></Box>}
            {showWalkThrough
                ?
                <WalkThroughModal
                    incrementWalkThroughSteps={incrementWalkThroughSteps}
                    showConfirmation={showWalkThrough && currWalkThroughObj?.step === 0}
                    endWalkThrough={endWalkThrough}
                    obj={currWalkThroughObj}
                /> : null
            }
            <WalkThroughPopover
                displayPopover={showWalkThrough && currWalkThroughObj?.step > 0}
                obj={currWalkThroughObj}
                incrementWalkThroughSteps={incrementWalkThroughSteps}
                endWalkThrough={endWalkThrough}
                anchorEl={anchorRef.current}
            />
        </Grid>
    )
}