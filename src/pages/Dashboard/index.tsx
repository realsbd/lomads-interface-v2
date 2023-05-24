import { useDAO } from "context/dao";
import React from "react"
import { makeStyles } from '@mui/styles';
import { useNavigate, useParams } from "react-router-dom"
import { Grid } from "@mui/material";
import Links from "./Links";
import Notifications from "./Notifications";


const useStyles = makeStyles((theme: any) => ({
    root: {
      display: 'flex',
      background: `linear-gradient(169.22deg,#fdf7f7 12.19%,#efefef 92%)`,
    }
  }));

export default () => {
    const { daoURL } = useParams();
    const navigate = useNavigate();
    const { DAO, DAOList } = useDAO();
    return (
        <Grid container maxWidth={"1079px"}>
            <Grid item sm={12}>
                <Links />
            </Grid>
            <Grid mt={1} item sm={12}>
                <Notifications isHelpIconOpen={false} />
            </Grid>
        </Grid>
    )
}