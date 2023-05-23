import React, { useState } from "react";

import { Paper, Typography, Box, Drawer } from "@mui/material";
import { makeStyles } from '@mui/styles';

import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import Button from "components/Button";

import CloseSVG from 'assets/svg/closeNew.svg'
import KRASVG from 'assets/svg/kra.svg'
import Dropdown from "components/Dropdown";

import { nanoid } from 'nanoid';

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
    open: boolean;
    closeModal(): any;
    list: any[];
    freq: any;
    getResults(action1: any[], action2: string): void;
    editKRA: boolean;
}

export default ({ open, closeModal, list, freq, getResults, editKRA }: Props) => {
    const classes = useStyles();
    const [frequency, setFrequency] = useState('Daily');
    const [resultCount, setResultCount] = useState(1);
    const [results, setResults] = useState([{ _id: nanoid(16), color: '#FFCC18', name: '', progress: 0 }]);

    // const handleChangeFrequency = (e) => {
    //     setFrequency(e.target.value);
    // }

    // const onChangeNumberOfResults = (e) => {
    //     let n = parseInt(e.target.value);
    //     setResultCount(n);
    //     let array = [...results];
    //     if (array.length === 0) {
    //         for (var i = 0; i < n; i++) {
    //             if (editKRA) {
    //                 array.push({ name: '', _id: nanoid(16) });
    //             }
    //             else {
    //                 array.push({ name: '', color: '#FFCC18', progress: 0, _id: nanoid(16) });
    //             }
    //         }
    //     }
    //     else if (n > array.length) {
    //         let count = n - array.length;
    //         for (var i = 0; i < count; i++) {
    //             if (editKRA) {
    //                 array.push({ name: '', _id: nanoid(16) });
    //             }
    //             else {
    //                 array.push({ name: '', color: '#FFCC18', progress: 0, _id: nanoid(16) });
    //             }
    //         }
    //     }
    //     else if (n < array.length) {
    //         let count = array.length - n;
    //         for (var i = 0; i < count; i++) {
    //             array.pop();
    //         }
    //     }
    //     setResults(array);
    // };

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
                    <img src={KRASVG} alt="project-resource" />
                    <Typography className={classes.modalTitle}>Key Results</Typography>
                    <Typography className={classes.modalSubtitle}>Set objective for your team</Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems={"center"} sx={{ width: '80%' }}>

                    <Box display="flex" flexDirection="column" sx={{ width: 310, marginBottom: '35px' }}>
                        <Typography className={classes.label}>Review Frequency</Typography>
                        <Dropdown
                            options={['Daily', 'Weekly', 'Monthly']}
                            onChange={(value) => console.log(value)}
                        />
                    </Box>

                    <Box display="flex" flexDirection="column" sx={{ width: 310 }}>
                        <Typography className={classes.label}>N° of key results</Typography>
                        <Dropdown
                            options={[1, 2, 3, 4, 5]}
                            onChange={(value) => console.log(value)}
                        />
                    </Box>

                    {results.length > 0 && <Box className={classes.divider}></Box>}

                    {
                        results.map((item, index) => {
                            return (
                                <Paper className={classes.mileStonePaper} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className={classes.paperTitle}>Key result {index + 1}</Typography>

                                    <Box display={"flex"} alignItems={'center'}>
                                        <TextInput
                                            label="Name"
                                            placeholder="Super project"
                                            fullWidth
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