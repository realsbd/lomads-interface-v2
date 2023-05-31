import React, { useState, useMemo, useEffect } from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { Typography, Box, Drawer, Chip } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";
import CurrencyInput from "components/CurrencyInput";
import TextEditor from 'components/TextEditor'

import { HiOutlinePlus } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg'

import CloseSVG from 'assets/svg/closeNew.svg'
import createTaskSvg from 'assets/svg/task.svg';

import { useSafeTokens } from "context/safeTokens";
import { useDAO } from "context/dao";
import { useWeb3Auth } from "context/web3Auth";
import { useAppDispatch } from "helpers/useAppDispatch";
import { useAppSelector } from "helpers/useAppSelector";
import MuiSelect from "components/Select";
import { beautifyHexToken } from "utils";
import Switch from "components/Switch";
import RolesListModal from "../RolesListModal";
import useTerminology from 'hooks/useTerminology';
import { isValidUrl } from 'utils';
import { CHAIN_INFO } from 'constants/chainInfo';
import { createTaskAction, draftTaskAction } from "store/actions/task";

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
    modalRow: {
        width: '400px',
        marginBottom: '35px !important'
    },
    optionalBox: {
        width: '110px',
        height: '25px',
        borderRadius: '100px !important',
        backgroundColor: 'rgba(118, 128, 141, 0.05) !important'
    },
    divider: {
        width: 210,
        border: '2px solid #C94B32',
        margin: '35px 0 !important'
    },
    tabBtn: {
        background: '#FFFFFF !important',
        color: '#C94B32 !important',
        opacity: '0.6 !important',
        boxShadow: '1px 2px 5px rgba(27, 43, 65, 0.12), 0px 0px 5px rgba(201, 75, 50, 0.18) !important',
        borderRadius: '5px !important',
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        cursor: 'pointer',
        '&.active': {
            opacity: '1 !important',
            boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important',
        }
    },
    rolesBox: {
        background: 'hsla(214, 9%, 51%, .05) !important',
        borderRadius: '5px !important',
        boxShadow: 'inset 1px 0 4px rgba(27, 43, 65, .1) !important',
        marginBottom: '20px !important',
        marginTop: '20px !important',
        padding: '16px !important',
        width: '100%',
    },
    addRoleBtn: {
        height: '40px !important',
        width: '40px !important',
    },
    rolePill: {
        width: 200,
        display: "flex !important",
        alignItems: "center !important",
        justifyContent: "flex-start !important",
    },
    deleteBtn: {
        height: '20px !important',
        width: '20px !important',
        borderRadius: '5px !important',
        background: 'rgba(27, 43, 65, 0.2) !important',
        marginleft: '18px !important',
        cursor: 'pointer !important',
        marginLeft: '18px !important'
    }
}));

interface Props {
    open: boolean;
    closeModal(): any;
    selectedProject?: any;
}

export default ({ open, closeModal, selectedProject }: Props) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { DAO } = useDAO();
    // @ts-ignore
    const { user } = useAppSelector(store => store.session);
    // @ts-ignore
    const { createTaskLoading, draftTaskLoading } = useAppSelector(store => store.task);
    const { safeTokens } = useSafeTokens();
    const { account, chainId } = useWeb3Auth();
    const { transformTask, transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies', null));

    const [contributionType, setContributionType] = useState('open');
    const [isSingleContributor, setIsSingleContributor] = useState(false);
    const [isFilterRoles, setIsFilterRoles] = useState(false);
    const [openRolesList, setOpenRolesList] = useState(false);
    const [validRoles, setValidRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [name, setName] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [dchannel, setDChannel] = useState('');
    const [deadline, setDeadline] = useState('');
    const [projectId, setProjectId] = useState(null);
    const [subLink, setSubLink] = useState('');
    const [reviewer, setReviewer] = useState(null);
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState<string>('');


    const [errorName, setErrorName] = useState('');
    const [errorDesc, setErrorDesc] = useState('');
    const [errorDchannel, setErrorDchannel] = useState('');
    const [errorSublink, setErrorSublink] = useState('');
    const [errorDeadline, setErrorDeadline] = useState('');
    const [errorApplicant, setErrorApplicant] = useState('');
    const [errorReviewer, setErrorReviewer] = useState('');
    const [errorCurrency, setErrorCurrency] = useState<boolean>(false);
    const [errorTaskValue, setErrorTaskValue] = useState<boolean>(false);

    useEffect(() => {
        if (createTaskLoading === false || draftTaskLoading === false) {
            setContributionType('open');
            setIsSingleContributor(false);
            setIsFilterRoles(false);
            setValidRoles([]);
            setSelectedUser(null);
            setName('');
            setDesc('');
            setDChannel('');
            setDeadline('');
            setProjectId(null);
            setSubLink('');
            setReviewer(null);
            setCurrency('');
            setAmount(0);
            closeModal();
        }
    }, [createTaskLoading, draftTaskLoading]);

    // useEffect(() => {
    //     if (account && chainId && (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))) {
    //         dispatch(getCurrentUser({}))
    //     }
    // }, [account, chainId, user])

    useEffect(() => { setReviewer(user._id) }, [user])

    const eligibleContributors = useMemo(() => {
        return _get(DAO, 'members', []).filter((m: any) => (reviewer || "").toLowerCase() !== m.member._id)
            .map((item: any) => { return { label: item.member.name && item.member.name !== "" ? `${item.member.name}  (${beautifyHexToken(item.member.wallet)})` : beautifyHexToken(item.member.wallet), value: item.member._id } });
    }, [DAO, selectedUser, reviewer]);

    const eligibleReviewers = useMemo(() => {
        return _get(DAO, 'members', []).filter((m: any) => _get(selectedUser, "_id", "").toLowerCase() !== m.member._id.toLowerCase() && (m.role === 'role1' || m.role === 'role2'))
            .map((item: any) => { return { label: item.member.name && item.member.name !== "" ? `${item.member.name}  (${beautifyHexToken(item.member.wallet)})` : beautifyHexToken(item.member.wallet), value: item.member._id } });

    }, [DAO, reviewer, selectedUser]);

    const eligibleProjects = useMemo(() => {
        return _get(DAO, 'projects', []).filter((p: any) => _find(p.members, m => m._id === user._id)).map((item: any) => { return { label: item.name, value: item._id } })
    }, [DAO, reviewer, selectedUser]);

    const getrolename = (roleId: any) => {

        for (let index = 0; index < Object.keys(_get(DAO, 'discord', {})).length; index++) {
            const element = Object.keys(_get(DAO, 'discord', {}))[index];
            const rolename_discord = _find(DAO.discord[element].roles, r => r.id === roleId)
            if (rolename_discord) {
                return rolename_discord.name
            }
        }
        return "";
    };

    const getroleColor = (roleId: any) => {

        if (roleId == "role1" || roleId == "role2" || roleId == "role3" || roleId == "role4") {
            if (roleId === 'role1')
                return { pill: 'rgba(146, 225, 168, 0.3)', circle: 'rgba(146, 225, 168, 1)' };
            else if (roleId === 'role2')
                return { pill: 'rgba(137,179,229,0.3)', circle: 'rgba(137,179,229,1)' };
            else if (roleId === 'role3')
                return { pill: 'rgba(234,100,71,0.3)', circle: 'rgba(234,100,71,1)' };
            else if (roleId === 'role4')
                return { pill: 'rgba(146, 225, 168, 0.3)', circle: 'rgba(146, 225, 168, 1)' };
        }
        for (let index = 0; index < Object.keys(_get(DAO, 'discord', {})).length; index++) {
            const element = Object.keys(_get(DAO, 'discord', {}))[index];
            const rolename_discord = _find(DAO.discord[element].roles, r => r.id === roleId)
            if (rolename_discord) {
                return { pill: `${_get(rolename_discord, 'roleColor', '#99aab5')}50`, circle: _get(rolename_discord, 'roleColor', '#99aab5') }
            }
        }
        return { pill: '#99aab550', circle: '#99aab5' };
    };


    const handleChangeCompensationAmount = (e: any) => {
        setAmount(parseFloat(e));
        setErrorTaskValue(false);
    }

    const handleChangeCurrency = (e: any) => {
        setCurrency(e);
        setErrorCurrency(false);
    }

    const handleSetApplicant = (value: string) => {
        let user = _find(DAO.members, m => m.member._id === value);
        setSelectedUser({ _id: user.member._id, address: user.wallet });
    }

    const handleRemoveRole = (role: any) => {
        setValidRoles(validRoles.filter((item) => item !== role))
    }

    const handleCreateTask = () => {
        if (name === '') {
            setErrorName('Enter name');
            let e = document.getElementById('error-name');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (desc === '') {
            let e = document.getElementById('error-desc');
            setErrorDesc('Enter description');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (dchannel === '') {
            setErrorDchannel('Enter a link');
            let e = document.getElementById('error-dchannel');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (dchannel && !isValidUrl(dchannel)) {
            setErrorDchannel('Enter a valid link');
            let e = document.getElementById('error-dchannel');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (deadline === '') {
            setErrorDeadline('Enter deadline')
            let e = document.getElementById('error-deadline');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (subLink && !isValidUrl(subLink)) {
            setErrorSublink('Enter a valid link');
            let e = document.getElementById('error-sublink');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (contributionType === 'assign' && selectedUser === null) {
            setErrorApplicant('Select an applicant');
            let e = document.getElementById('error-applicant');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (currency === '') {
            setErrorCurrency(true);
            let e = document.getElementById('error-currency-amt');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (amount === 0) {
            setErrorTaskValue(true);
            let e = document.getElementById('error-currency-amt');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else if (reviewer === null) {
            setErrorReviewer('Select a reviewer');
            let e = document.getElementById('error-reviewer');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        else {
            let tempLink, tempSub = null;
            if (dchannel && dchannel !== '') {
                tempLink = dchannel;
                if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                    tempLink = 'https://' + tempLink;
                }
            }
            if (subLink && subLink !== '') {
                tempSub = subLink;
                if (tempSub !== '' && tempSub.indexOf('https://') === -1 && tempSub.indexOf('http://') === -1) {
                    tempSub = 'https://' + tempSub;
                }
            }
            let symbol = _find(safeTokens, tkn => tkn.tokenAddress === currency)
            symbol = _get(symbol, 'token.symbol', null)
            if (!symbol)
                symbol = currency === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS ? CHAIN_INFO[chainId]?.nativeCurrency?.symbol : 'SWEAT'
            let task: any = {};
            task.daoId = DAO?._id;
            task.name = name;
            task.description = desc;
            task.applicant = selectedUser;
            task.projectId = selectedProject ? selectedProject._id : projectId;
            task.discussionChannel = tempLink;
            task.deadline = deadline;
            task.submissionLink = tempSub ? tempSub : '';
            task.compensation = { currency: currency, amount, symbol };
            task.reviewer = reviewer;
            task.contributionType = contributionType;
            task.isSingleContributor = isSingleContributor;
            task.isFilterRoles = isFilterRoles;
            task.validRoles = isFilterRoles ? validRoles : [];
            console.log("Task : ", task);
            dispatch(createTaskAction(task))
        }
    }

    const handleDraftTask = () => {
        let tempLink, tempSub = null;
        if (name === '') {
            setErrorName('Enter name');
            let e = document.getElementById('error-name');
            if (e) {
                e.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" });
            }
            return;
        }
        if (dchannel && dchannel !== '') {
            tempLink = dchannel;
            if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                tempLink = 'https://' + tempLink;
            }
        }
        if (subLink && subLink !== '') {
            tempSub = subLink;
            if (tempSub !== '' && tempSub.indexOf('https://') === -1 && tempSub.indexOf('http://') === -1) {
                tempSub = 'https://' + tempSub;
            }
        }
        let symbol = _find(safeTokens, tkn => tkn.tokenAddress === currency)
        symbol = _get(symbol, 'token.symbol', 'SWEAT')
        if (!symbol)
            symbol = currency === process.env.REACT_APP_NATIVE_TOKEN_ADDRESS ? CHAIN_INFO[chainId]?.nativeCurrency?.symbol : 'SWEAT'
        let task: any = {};
        task.daoId = DAO?._id;
        task.name = name;
        task.description = desc;
        task.applicant = selectedUser;
        task.projectId = selectedProject ? selectedProject._id : projectId;;
        task.discussionChannel = tempLink;
        task.deadline = deadline;
        task.submissionLink = tempSub ? tempSub : '';
        task.compensation = { currency: currency, amount, symbol };
        task.reviewer = reviewer;
        task.contributionType = contributionType;
        task.isSingleContributor = isSingleContributor;
        task.isFilterRoles = isFilterRoles;
        task.validRoles = validRoles;

        dispatch(draftTaskAction(task))
    }

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            open={open}
            sx={{ zIndex: '1102' }}
        >
            <RolesListModal
                open={openRolesList}
                closeModal={() => setOpenRolesList(false)}
                hideBackdrop={true}
                validRoles={validRoles}
                handleValidRoles={(value) => setValidRoles(value)}
            />

            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>

                <Box display="flex" flexDirection="column" alignItems="center" className={classes.modalRow}>
                    <img src={createTaskSvg} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Create Task</Typography>
                </Box>

                <Box className={classes.modalRow} id="error-name">
                    <TextInput
                        label="Name of the project"
                        placeholder="Super project"
                        fullWidth
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); setErrorName('') }}
                        error={errorName !== ''}
                        id={errorName !== '' ? "outlined-error-helper-text" : ""}
                        helperText={errorName}
                    />
                </Box>

                <Box className={classes.modalRow} id="error-desc">
                    <TextEditor
                        fullWidth
                        height={130}
                        width={400}
                        placeholder="Marketing BtoB"
                        label="Short description"
                        value={desc}
                        onChange={(value: string) => { setDesc(value); setErrorDesc('') }}
                        error={errorDesc !== ''}
                        id={errorDesc !== '' ? "outlined-error-helper-text" : ""}
                        helperText={errorDesc}
                    />
                </Box>

                <Box className={classes.modalRow} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box sx={{ width: 218 }} id="error-dchannel">
                        <TextInput
                            label="Discussion channel"
                            placeholder="Super project"
                            fullWidth
                            value={dchannel}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDChannel(e.target.value); setErrorDchannel('') }}
                            error={errorDchannel !== ''}
                            id={errorDchannel !== '' ? "outlined-error-helper-text" : ""}
                            helperText={errorDchannel}
                        />
                    </Box>
                    <Box sx={{ width: 160 }} id="error-deadline">
                        <TextInput
                            label="Deadline"
                            fullWidth
                            value={deadline}
                            type={"date"}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDeadline(e.target.value); setErrorDeadline('') }}
                            error={errorDeadline !== ''}
                            id={errorDeadline !== '' ? "outlined-error-helper-text" : ""}
                            helperText={errorDeadline}
                        />
                    </Box>
                </Box>

                <Box className={classes.modalRow} sx={{ margin: '0px !important' }}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '10px' }}>
                        <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>In project</Typography>
                        <Box className={classes.optionalBox} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Typography sx={{ color: 'rgba(118, 128, 141, 0.5)', fontWeight: '700' }}>Optional</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <MuiSelect
                            options={eligibleProjects}
                            setSelectedValue={(value) => setProjectId(value)}
                        />
                    </Box>
                </Box>

                <Box className={classes.divider}></Box>

                <Box className={classes.modalRow}>
                    <Box sx={{ marginBottom: '10px' }}><Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Contribution</Typography></Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Box
                            className={contributionType === 'assign' ? `${classes.tabBtn} active` : `${classes.tabBtn}`}
                            sx={{ width: '204px', height: '60px' }}
                            onClick={() => { setContributionType('assign'); setIsFilterRoles(false); setValidRoles([]); setIsSingleContributor(false); }}
                        >
                            <Typography sx={{ fontSize: '20px' }}>ASSIGN MEMBER</Typography>
                        </Box>
                        <Box
                            className={contributionType === 'open' ? `${classes.tabBtn} active` : `${classes.tabBtn}`}
                            sx={{ width: '176px', height: '60px' }}
                            onClick={() => { setContributionType('open'); setSelectedUser(null); }}
                        >
                            <Typography sx={{ fontSize: '20px' }}>OPEN</Typography>
                        </Box>
                    </Box>

                    {
                        contributionType === 'assign' &&
                        <>
                            <Box sx={{ margin: '18px 0 9px 0' }}>
                                <Typography sx={{ fontSize: '14px', color: 'rgba(118, 128, 141, 0.5)' }}>This member will be in charge of completing this task</Typography>
                            </Box>
                            <Box sx={{ width: '100%' }} id="error-applicant">
                                <MuiSelect
                                    options={eligibleContributors}
                                    setSelectedValue={(value) => { handleSetApplicant(value); setErrorApplicant('') }}
                                    errorSelect={errorApplicant}
                                />
                            </Box>
                        </>
                    }

                    {
                        contributionType === 'open' &&
                        <Box sx={{ width: '100%', marginTop: '18px' }} display={"flex"} flexDirection={"column"}>
                            <Box sx={{ width: '100%', marginBottom: '20px' }} display={"flex"} alignItems={"flex-start"}>
                                <Switch checkedSVG="checkmark" onChange={() => setIsSingleContributor(prev => !prev)} />
                                <Box>
                                    <Typography sx={{ fontSize: '16px', color: '#76808D', marginBottom: '6px' }}>SINGLE CONTRIBUTOR</Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#76808D', opacity: '0.5' }}>The reviewer will pick a contributor from the applicants (if unchecked, everyone can contribute)</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ width: '100%' }} display={"flex"} alignItems={"center"}>
                                <Switch checkedSVG="checkmark" onChange={() => setIsFilterRoles(prev => !prev)} />
                                <Box>
                                    <Typography sx={{ fontSize: '16px', color: '#76808D', marginBottom: '6px' }}>FILTER BY ROLES (DISCORD)</Typography>
                                </Box>
                            </Box>
                        </Box>
                    }

                    {
                        isFilterRoles && validRoles &&
                        <Box className={classes.rolesBox} display={"flex"} justifyContent={"space-between"} alignItems={"flex-start"}>
                            <Box display={"flex"} flexDirection={"column"}>
                                {
                                    validRoles.map((item, index) => {
                                        return (
                                            <Box display={"flex"} alignItems={"center"} sx={index === validRoles.length - 1 ? { marginBottom: '0px' } : { marginBottom: '10px' }} key={index}>
                                                <Chip
                                                    label={item == "role1" || item == "role2" || item == "role3" || item == "role4" ? transformRole(item).label : getrolename(item)}
                                                    className={classes.rolePill}
                                                    avatar={<Box sx={{ background: getroleColor(item).circle, borderRadius: '50%' }}></Box>}
                                                    sx={{ background: getroleColor(item).pill }}
                                                />
                                                <Box className={classes.deleteBtn} onClick={() => handleRemoveRole(item)} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                                    <CgClose color='#FFF' />
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                            <Button variant="contained" color="secondary" className={classes.addRoleBtn} onClick={() => setOpenRolesList(true)}>
                                <HiOutlinePlus size={24} color='#C94B32' />
                            </Button>
                        </Box>
                    }
                </Box>

                <Box className={classes.modalRow} sx={{ margin: '0px !important' }} id="error-sublink">
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '10px' }}>
                        <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Submission Link</Typography>
                        <Box className={classes.optionalBox} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Typography sx={{ color: 'rgba(118, 128, 141, 0.5)', fontWeight: '700' }}>Optional</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(118, 128, 141, 0.5)' }}>Provide a link here only if the submissions will<br />come from trusted contributors</Typography>
                    </Box>
                    <TextInput
                        placeholder="Google driver folder, Notion page, Github..."
                        fullWidth
                        value={subLink}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSubLink(e.target.value); setErrorSublink('') }}
                        error={errorSublink !== ''}
                        id={errorSublink !== '' ? "outlined-error-helper-text" : ""}
                        helperText={errorSublink}
                    />
                </Box>

                <Box className={classes.divider}></Box>

                <Box className={classes.modalRow} id="error-currency-amt">
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '10px' }}>
                        <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Compensation</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <CurrencyInput
                            value={amount}
                            onChange={(value: any) => handleChangeCompensationAmount(value)}
                            options={safeTokens}
                            dropDownvalue={currency}
                            onDropDownChange={(value: any) => {
                                handleChangeCurrency(value)
                            }}
                            variant="primary"
                            errorCurrency={errorCurrency}
                            errorProjectValue={errorTaskValue}
                        />
                    </Box>
                </Box>

                <Box className={classes.modalRow} id="error-reviewer">
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '10px' }}>
                        <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Reviewer</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <MuiSelect
                            options={eligibleReviewers}
                            setSelectedValue={(value) => { setReviewer(value); setErrorReviewer('') }}
                            errorSelect={errorReviewer}
                        />
                    </Box>
                </Box>

                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%' }}>
                    <Button variant="outlined" sx={{ marginRight: '20px', width: '240px' }} onClick={handleDraftTask} loading={draftTaskLoading}>SAVE AS DRAFT</Button>
                    <Button variant="contained" sx={{ width: '240px' }} onClick={handleCreateTask} loading={createTaskLoading}>CREATE</Button>
                </Box>

            </Box>
        </Drawer>
    )
}