import { TableCell, Box } from "@mui/material";
import Chip from '@mui/material/Chip';
import React from "react";

export default () => {
    return (
        <TableCell>
            <Box>
                <Chip label="Management" size="small" color="primary" />
            </Box>
        </TableCell>
    )
}