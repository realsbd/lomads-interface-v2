import { Box } from "@mui/material";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { useDAO } from "context/dao";
import React from "react"
import { makeStyles } from '@mui/styles';
import { useNavigate, useParams } from "react-router-dom"
import { Grid } from "@mui/material";
import Links from "./Links";
import Notifications from "./Notifications";
import TaskSection from "sections/TaskSection";
import ProjectSection from "sections/ProjectSection";
import MembersSection from "sections/MembersSection";
import { useAppSelector } from "helpers/useAppSelector";
import Treasury from "./Treasury";
import { useWeb3Auth } from "context/web3Auth";
import useRole from "hooks/useRole";


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
    console.log("DAO", DAO);
    const { account } = useWeb3Auth();
    const { myRole, can } = useRole(DAO, account);
    // @ts-ignore
    const { setProjectLoading, Project } = useAppSelector(store => store.project);
    return (
        <Grid container>
            <Grid item sm={12}>
                <Links />
            </Grid>
            <Grid mt={1} item sm={12}>
                <Notifications isHelpIconOpen={false} />
            </Grid>
            <Grid sm={12}>
                <TaskSection onlyProjects={false} />
            </Grid>
            <Grid sm={12}>
                <ProjectSection />
            </Grid>
            {/* <Grid sm={12}>
                <MembersSection
                    list={_get(DAO, 'members', [])}
                    showProjects={false}
                />
            </Grid> */}
            {can(myRole, 'transaction.view') && <Grid mt={1} item sm={12}>
                <Treasury />
            </Grid>}
        </Grid>
    )
}