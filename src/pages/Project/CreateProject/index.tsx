import React, { useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';

import createProjectSvg from 'assets/svg/createProject.svg';
import TextInput from 'components/TextInput'
import TextEditor from 'components/TextEditor'
import Button from "components/Button";

const useStyles = makeStyles((theme: any) => ({
    root: {
        height: "100vh",
        maxHeight: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden !important'
    },
    heading: {
        fontSize: "32px !important",
        margin: "20px 0 35px 0 !important"
    },
    paperContainer: {
        width: 394,
        borderRadius: 5,
        padding: '26px 22px',
        boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1) !important'
    }
}));

export default () => {
    const classes = useStyles();

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [next, setNext] = useState(false);

    return (
        <>
            <Grid container className={classes.root}>
                <Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
                    <img src={createProjectSvg} alt="frame-icon" />
                    <Typography color="primary" variant="subtitle1" className={classes.heading}>Create new Project</Typography>
                    <Paper className={classes.paperContainer}>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextInput
                                label="Name of the project"
                                placeholder="Super project"
                                fullWidth
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />
                        </Box>
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextEditor
                                fullWidth
                                height={90}
                                placeholder="Marketing BtoB"
                                label="Short description"
                                value={desc}
                                onChange={(value: string) => setDesc(value)}
                            />
                        </Box>
                        <Button
                            variant='contained'
                            disabled={name !== '' && desc !== '' ? false : true}
                            sx={{ width: 350 }}
                            onClick={() => setNext(true)}
                        >
                            NEXT
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}