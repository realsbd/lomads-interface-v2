import { TableCell, Box, Typography } from "@mui/material";
import TextInput from "components/TextInput";
import React, { useMemo } from "react";

export default ({ index }: any) => {

    const text = useMemo(() => {
        if(index % 3 === 0) {
            return "This is dummy comment"
        }
        return null
    }, [index])

    return (
        <TableCell>
            <Box>
                { !text ? <TextInput size="small"/> : <Typography>{ text }</Typography> }
            </Box>
        </TableCell>
    )
}