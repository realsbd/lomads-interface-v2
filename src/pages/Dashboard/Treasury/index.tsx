import React, { useEffect } from "react"
import clsx from "clsx";
import { Grid, Box, Typography, Divider, Skeleton, TableContainer, Table, TableBody } from "@mui/material"
import { makeStyles } from '@mui/styles';
import { useDAO } from "context/dao";
import { useParams } from "react-router-dom";
import { useAppSelector } from "helpers/useAppSelector";
import { useAppDispatch } from "helpers/useAppDispatch";
import { loadTreasuryAction } from "store/actions/treasury";
import Row from "./components/Row";

const useStyles = makeStyles((theme: any) => ({
    root: {

    },
    header: {
        height: 72,
        //filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.09))",
        backgroundColor: "#FFF",
        borderRadius: 5,
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    table: {
        //filter: "drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.09))",
        backgroundColor: "#FFF",
        borderRadius: 5
    },
    tabs: {
        display: "flex",
        flexDirection: 'row'
    },
    verDivider: {
        opacity: 0.3,
        border: '1px solid #1B2B41',
        margin: '0 16px',
        height: 32
    },
    tab: {
        cursor: 'pointer'
    },
    tabItem: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '400 !important',
        fontSize: '20px !important',
        lineHeight:'27px !important',
        color: '#1B2B41',
        opacity: 0.3
    },
    tabItemActive: {
        opacity: 0.7
    },
    helpCard: {
        position: "absolute",
        top: "0",
        left: "0",
        borderRadius: "10px",
        fontFamily: "'Inter', sans-serif",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        backgroundColor: "#76808D",
        zIndex: 999,
        width: "100% !important",
        height: "100%",
        opacity: 0.8,
        textAlign: "center",
        cursor: "pointer",
        padding: "10px"
    }
  }));

export default ({isHelpIconOpen}: {isHelpIconOpen: boolean}) => {
    const classes = useStyles();
    const dispatch = useAppDispatch()
    const { DAO } = useDAO();
    const { daoURL } = useParams()

    //@ts-ignore
    const { treasury } = useAppSelector(store => store.treasury)

    console.log("treasury", treasury)

    useEffect(() => {
        if(DAO && DAO.url === daoURL && !treasury) {
            let safes = DAO?.safes ? DAO?.safes.map((safe: any) => safe.address) : [DAO?.safe?.address]
            dispatch(loadTreasuryAction({ safes, daoId: DAO?._id }))
        }
    }, [DAO, daoURL])

    return (
        <Grid container>
            <Grid item sm={12}>
                { (!DAO || !treasury)  ? 
                <Skeleton sx={{ borderRadius: 1 }}  variant="rectangular" height={72} animation="wave" /> :
                <Box className={classes.header}>
                    <Box className={classes.tabs}>
                        <Box className={classes.tab}>
                            <Typography className={clsx([classes.tabItem, classes.tabItemActive])}>Treasury</Typography>
                        </Box>
                        <Box className={classes.verDivider} />
                        <Box className={classes.tab}>
                            <Typography className={classes.tabItem}>Recurring payments</Typography>
                        </Box>
                    </Box>
                </Box> }
            </Grid>
            <Grid mt={0.5} item sm={12}>
            {isHelpIconOpen && <Box sx={{position: 'relative', width: "100%", height: "100%"}}>
                                           <Box className={classes.helpCard}>
											    Managing and automating your treasury has never been easier! Here you can approve and send token payments manually, or set up recurring payments to team members!
									        </Box>
                                        </Box>}
                { (!DAO || !treasury)  ? 
                <Skeleton sx={{ borderRadius: 1 }} variant="rectangular" height={72} animation="wave" /> :
                <Box className={classes.header}>
                </Box>
                }
            </Grid>
            <Grid mt={0.5} mb={1} item sm={12}>
                <Box className={classes.table}>
                    <TableContainer  style={{ maxHeight: 500 }} component={Box}>
                        <Table size="small" stickyHeader aria-label="simple table">
                            <TableBody>
                                {
                                    treasury && treasury.map((txn:any) => <Row transaction={txn} />)
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>
        </Grid>
    )
}