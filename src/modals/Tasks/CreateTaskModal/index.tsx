import React, { useState } from "react";

import { Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";
import CurrencyInput from "components/CurrencyInput";
import TextEditor from 'components/TextEditor'
import Dropdown from "components/Dropdown";

import CloseSVG from 'assets/svg/closeNew.svg'
import createTaskSvg from 'assets/svg/task.svg';

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
}));

interface Props {
    open: boolean;
    closeModal(): any;
}

const safeTokens = [
    {
        tokenAddress: '0x123456789abcd000',
        token: {
            symbol: 'GOR'
        }
    },
    {
        tokenAddress: '0x123456789abcd000',
        token: {
            symbol: 'MATIC'
        }
    }
]

export default ({ open, closeModal }: Props) => {
    const classes = useStyles();
    const [name, setName] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [sweatValue, setSweatValue] = useState(null);
    const [currency, setCurrency] = useState(null);

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>

                <Box display="flex" flexDirection="column" alignItems="center" className={classes.modalRow}>
                    <img src={createTaskSvg} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Create Task</Typography>
                </Box>

                <Box className={classes.modalRow}>
                    <TextInput
                        label="Name of the project"
                        placeholder="Super project"
                        fullWidth
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                </Box>

                <Box className={classes.modalRow}>
                    <TextEditor
                        fullWidth
                        height={90}
                        placeholder="Marketing BtoB"
                        label="Short description"
                        value={desc}
                        onChange={(value: string) => setDesc(value)}
                    />
                </Box>

                <Box className={classes.modalRow} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box sx={{ width: 218 }}>
                        <TextInput
                            label="Discussion channel"
                            placeholder="Super project"
                            fullWidth
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ width: 160 }}>
                        <TextInput
                            label="Deadline"
                            fullWidth
                            value={name}
                            type={"date"}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
                        <Dropdown
                            options={['Select project...']}
                            onChange={(value: any) => console.log(value)}
                        />
                    </Box>
                </Box>

                <Box className={classes.divider}></Box>

                <Box className={classes.modalRow}>
                    <Box sx={{ marginBottom: '10px' }}><Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Contribution</Typography></Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Box className={`${classes.tabBtn} active`} sx={{ width: '204px', height: '60px' }}><Typography sx={{ fontSize: '20px' }}>ASSIGN MEMBER</Typography></Box>
                        <Box className={classes.tabBtn} sx={{ width: '176px', height: '60px' }}><Typography sx={{ fontSize: '20px' }}>OPEN</Typography></Box>
                    </Box>
                    <Box sx={{ margin: '18px 0 9px 0' }}>
                        <Typography sx={{ fontSize: '14px', color: 'rgba(118, 128, 141, 0.5)' }}>This member will be in charge of completing this task</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Dropdown
                            options={['Select Member...']}
                            onChange={(value: any) => console.log(value)}
                        />
                    </Box>
                </Box>

                <Box className={classes.modalRow} sx={{ margin: '0px !important' }}>
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
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                </Box>

                <Box className={classes.divider}></Box>

                <Box className={classes.modalRow}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '10px' }}>
                        <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Compensation</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <CurrencyInput
                            value={0}
                            onChange={(value: any) => {
                                setSweatValue(value)
                            }}
                            options={
                                safeTokens.map(t => {
                                    return {
                                        value: t.tokenAddress,
                                        label: t.token.symbol
                                    }
                                })
                            }
                            dropDownvalue={currency}
                            onDropDownChange={(value: any) => {
                                setCurrency(value)
                            }}
                            variant="primary"
                        />
                    </Box>
                </Box>

                <Box className={classes.modalRow}>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} sx={{ marginBottom: '10px' }}>
                        <Typography sx={{ color: '#76808D', fontWeight: '700', fontSize: '16px' }}>Reviewer</Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Dropdown
                            options={['Select Reviewer...']}
                            onChange={(value: any) => console.log(value)}
                        />
                    </Box>
                </Box>

            </Box>
        </Drawer>
    )
}