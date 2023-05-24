import React from 'react';
import { Typography, Box, TextField, FormControl, FormLabel, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
    root: {
        "& .MuiFormHelperText-root": {
            color: '#FFF',
            backgroundColor: '#EA6447',
            borderRadius: '0 0 5px 5px',
            padding: '5px 10px',
            marginTop: '0'
        },
        "& .MuiFormHelperText-root.Mui-error": {
            color: '#FFF',
        }
    }
}));

export default ({ labelChip, fullWidth, label, ...props }: any) => {
    const classes = useStyles();
    return (
        <FormControl fullWidth={fullWidth}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <FormLabel error={props.error} component="legend" sx={{ marginBottom: '10px' }}>{label}</FormLabel>
                {labelChip}
            </Box>
            <TextField {...props} className={classes.root} />
        </FormControl>
    )
}