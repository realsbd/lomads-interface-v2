import { TableCell, Typography, Box } from "@mui/material";
import React from "react";
import DebitSvg from 'assets/svg/sendTokenOutline.svg'
import DebitExecutedSvg from 'assets/svg/sendToken.svg'
import CreditSvg from 'assets/svg/receiveToken.svg'

export default ({ credit = false, executed = false, amount, token }: any) => {
    return (
        <TableCell>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                { !(isNaN(amount) || !token) ? <img style={{ width: 24, height: 24 }} src={credit ? CreditSvg : executed ? DebitExecutedSvg : DebitSvg } /> : <Box sx={{ width: 24, height: 24 }}></Box> }
                <Typography ml={1}>{ isNaN(amount) || !token ? '-' : parseFloat(amount).toFixed(4) }</Typography>
                <Typography ml={1}>{ token }</Typography>
            </Box>
        </TableCell>
    )
}