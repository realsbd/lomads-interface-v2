import React, { useState } from "react";

import { Grid, Paper, Typography, Box, Select, MenuItem, FormControl, Chip, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";

import CloseSVG from 'assets/svg/close-new.svg'
import MilestoneSVG from 'assets/svg/milestone.svg'
import { AiOutlinePlus, AiFillQuestionCircle, AiOutlineLock } from "react-icons/ai";
import { IoCloseOutline } from 'react-icons/io5';
import CurrencyInput from "components/CurrencyInput";
import Dropdown from "components/Dropdown";
import TextEditor from "components/TextEditor";

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
        marginBottom: '8px !important'
    },
    dropdown: {
        background: 'linear-gradient(180deg, #FBF4F2 0 %, #EEF1F5 100 %) !important',
        borderRadius: '10px',
    },
    divider: {
        width: 210,
        border: '2px solid #C94B32',
        margin: '35px 0 !important'
    },
    mileStonePaper: {
        width: 340,
        padding: '20px 22px !important',
        background: '#FFF !important',
        boxShadow: '0px 3px 3px rgba(27, 43, 65, 0.1), -1px -2px 3px rgba(201, 75, 50, 0.05) !important',
        borderRadius: '5px !important',
        marginBottom: '35px !important'
    },
    paperTitle: {
        fontSize: '16px !important',
        fontWeight: '700 !important',
        lineHeight: '18px !important',
        color: '#B12F15',
        marginBottom: '20px !important'
    }
}));

interface Props {
    open?: boolean;
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
    const [sweatValue, setSweatValue] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [milestones, setMilestones] = useState([{ name: '', amount: '0', deadline: '', deliverables: '', complete: false }]);
    const [milestoneCount, setMilestoneCount] = useState(1);

    const onChangeNumberOfMilestones = (e: number) => {
        let n = e;
        setMilestoneCount(n);
        let array = [...milestones];

        if (array.length === 0) {
            for (var i = 0; i < n; i++) {
                array.push({ name: '', amount: '0', deadline: '', deliverables: '', complete: false });
            }
        }
        else if (n > array.length) {
            let count = n - array.length;
            for (var i = 0; i < count; i++) {
                array.push({ name: '', amount: '0', deadline: '', deliverables: '', complete: false });
            }
        }
        else if (n < array.length) {
            let count = array.length - n;
            for (var i = 0; i < count; i++) {
                array.pop();
            }
        }

        // for (var i = 0; i < milestones.length; i++) {
        //     var el = document.getElementById(`inputBox${i}`);
        //     el.style.background = '';
        // }

        setMilestones(array);
    };

    // const handleChangeName = (e:string, index:number) => {
    //     let element = document.getElementById(`name${index}`);
    //     element.innerHTML = "";
    //     const newArray = milestones.map((item, i) => {
    //         if (i === index) {
    //             return { ...item, name: e };
    //         } else {
    //             return item;
    //         }
    //     });
    //     setMilestones(newArray);
    // }

    // const handleChangeAmount = (e:string, index:number) => {
    //     var x = document.getElementById(`amount${milestones.length - 1}`);
    //     x.innerHTML = '';
    //     var el = document.getElementById(`inputBox${index}`);
    //     el.style.background = '';
    //     if (e <= 100) {
    //         const newArray = milestones.map((item, i) => {
    //             if (i === index) {
    //                 return { ...item, amount: e };
    //             } else {
    //                 return item;
    //             }
    //         });
    //         setMilestones(newArray);
    //     }
    // }

    // const handleChangeDeadline = (e:any, index:number) => {
    //     let element = document.getElementById(`deadline${index}`);
    //     element.innerHTML = "";

    //     const newArray = milestones.map((item, i) => {
    //         if (i === index) {
    //             return { ...item, deadline: e };
    //         } else {
    //             return item;
    //         }
    //     });
    //     setMilestones(newArray);
    // }

    // const handleChangeDeliverables = (e:any, index:number) => {
    //     let element = document.getElementById(`deliverables${index}`);
    //     element.innerHTML = "";
    //     const newArray = milestones.map((item, i) => {
    //         if (i === index) {
    //             return { ...item, deliverables: e };
    //         } else {
    //             return item;
    //         }
    //     });
    //     setMilestones(newArray);
    // }

    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 1 }}
            anchor={'right'}
            open={open}
        >
            <Box className={classes.modalConatiner}>
                <IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={closeModal}>
                    <img src={CloseSVG} />
                </IconButton>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img src={MilestoneSVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Project Milestones</Typography>
                    <Typography className={classes.modalSubtitle}>Organise and link payments to milestones</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%' }}>

                    <Box display="flex" flexDirection="column" sx={{ width: 310, marginBottom: '35px' }}>
                        <Typography className={classes.label}>Total Workspace Value</Typography>
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

                    <Box display="flex" flexDirection="column" sx={{ width: 310 }}>
                        <Typography className={classes.label}>Milestones</Typography>
                        <Dropdown
                            options={[1, 2, 3, 4, 5]}
                            onChange={(value) => onChangeNumberOfMilestones(value)}
                        />
                    </Box>

                    {milestones.length > 0 && <Box className={classes.divider}></Box>}

                    {
                        milestones.map((item, index) => {
                            return (
                                <Paper className={classes.mileStonePaper} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className={classes.paperTitle}>Milestone {index + 1}</Typography>

                                    <Box display={"flex"} alignItems={'center'} sx={{ marginBottom: '20px' }}>
                                        <TextInput
                                            type="number"
                                            min={0}
                                            max={100}
                                            sx={{ width: 70 }} />
                                        <Typography sx={{ fontWeight: '700', fontSize: 16, color: '#76808D', marginLeft: '13.5px' }}>% of project value</Typography>
                                    </Box>

                                    <Box sx={{ marginBottom: '20px' }}>
                                        <TextInput sx={{ width: 172 }} label="Due date" type="date" />
                                    </Box>

                                    <Box>
                                        <TextEditor
                                            fullWidth
                                            height={90}
                                            placeholder=""
                                            label="Deliverables"
                                        />
                                    </Box>
                                </Paper>
                            )
                        })
                    }

                    <Box display={"flex"} alignItems={"center"} justifyContent={"center"} style={{ width: '100%' }}>
                        <Button variant="outlined" sx={{ marginRight: '20px' }}>CANCEL</Button>
                        <Button variant="contained">ADD</Button>
                    </Box>

                </Box>
            </Box>
        </Drawer>
    )
}