import { TableCell, Box, Typography, Button, IconButton } from "@mui/material";
import moment from "moment";
import React, { useMemo } from "react";
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import palette from "theme/palette";


const useStyles = makeStyles((theme: any) => ({
    root: {

    }
  }));

export default ({ transaction, txnCount, index }: any) => {
    const classes = useStyles()
    const isMultiTxn = useMemo(() => {
        return txnCount > 1
    }, [transaction, txnCount])

    if(index === 0) {
        if(transaction.executionDate) {
            return <TableCell style={{ width: 120 }} align="right">
                <Typography>{ moment.utc(transaction.executionDate).local().format('MM/DD HH:mm') }</Typography>
            </TableCell>
        } else {
            return (
                <TableCell style={{ width: 120 }} align="right">
                    { ( transaction?.canExecuteTxn || transaction?.canRejectTxn ) ?
                        <Box>
                            { 
                                transaction?.canExecuteTxn ? <Button sx={{ height: 30, padding: 0, minWidth: 120, width: 120, fontSize: 14 }} size="small" variant="contained" color="primary">Execute</Button> : 
                                transaction?.canRejectTxn ? <Button sx={{ height: 30, padding: 0, minWidth: 120, width: 120, fontSize: 14 }} size="small" variant="contained" color="primary">Reject</Button> : null
                            }
                        </Box> : 
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
                            <Button  style={{ padding: 0, minWidth: 30, maxWidth: 30, width: 30, height: 30 }} color="primary" variant="outlined" disabled={transaction?.hasMyRejection} size="small">
                                <CloseIcon style={{ fontSize: 16 }} />
                            </Button>
                            <Button sx={{ ml: 1 }} color="primary" variant="contained" style={{ padding: 0, minWidth: 30, maxWidth: 30, width: 30, height: 30 }} disabled={transaction?.hasMyConfirmation} size="small">
                                <CheckIcon style={{ fontSize: 16 }} />
                            </Button>
                        </Box>
                    }
                </TableCell>
            )
        }
    } else if (isMultiTxn && (index == txnCount - 1)) {
        return (
            <TableCell  align="right" sx={{ position: 'relative' }}>
                <Box style={{ height: '50%', bottom: 0, right: 16, top: 0, left: 16, position: 'absolute', borderBottom: '1px solid #76808D' }}></Box>
                <Box style={{ height: '50%', bottom: 0, right: 16, top: 0, left: 16, position: 'absolute', borderRight: '1px solid #76808D' }}></Box>
            </TableCell>
        )
    } else {
        return (
            <TableCell align="right" sx={{ position: 'relative' }}>
                <Box style={{ height: '50%', bottom: 0, right: 16, top: 0, left: 16, position: 'absolute', borderBottom: '1px solid #76808D' }}></Box>
                <Box style={{ bottom: 0, right: 16, top: 0, left: 16, position: 'absolute', borderRight: '1px solid #76808D' }}></Box>
            </TableCell>
        )
    }
}