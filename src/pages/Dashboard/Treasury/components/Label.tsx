import { TableCell, Box, Typography } from "@mui/material";
import { get as _get } from 'lodash'
import TextInput from "components/TextInput";
import React, { useMemo } from "react";

export default ({ transaction, recipient }: any) => {

    const label = useMemo(() => {
        if(transaction && recipient) {
            const metadata = _get(transaction, `metadata.${recipient}`, null)
            if(metadata){
                return metadata?.label
            }
        }
        return null
    }, [transaction, recipient])
    
    return (
        <TableCell>
            <Box>
                { !label ? <TextInput placeholder="Reason for transaction" fullWidth size="small"/> : <Typography>{ label }</Typography> }
            </Box>
        </TableCell>
    )
}