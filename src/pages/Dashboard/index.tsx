import { Box } from "@mui/material";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { useDAO } from "context/dao";
import React, { useState } from "react"
import { makeStyles } from '@mui/styles';
import axiosHttp from 'api'
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
import Button from "components/Button";
import moment from "moment";
import { beautifyHexToken } from "utils";
import { CHAIN_INFO } from "constants/chainInfo";
import { SupportedChainId } from "constants/chains";
import ProfileModal from "modals/Profile/ProfileModal";


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
    const { myRole, can } = useRole(DAO, account, undefined)
    // @ts-ignore
    const { setProjectLoading, Project } = useAppSelector(store => store.project);


    // const send = async () => {
    //     try {
    //         await axiosHttp.post(`utility/send-alert`, { alertType: 'mint-success', to: ["kyle@reputable.health"], data: {
    //             organizationName: "Reputable",
    //             organizationLogo: "https://lomads-dao-development.s3.eu-west-3.amazonaws.com/SBT/XhtV_5RqsUvyid7TzP1fqj7ZQ6-getQq.png",
    //             sbtName: `The Quantified Collective Membership  SBT #54`,
    //             mintDate: moment().local().format('DD-MMM-YYYY'),
    //             contractAddress:  beautifyHexToken("0xeD14Cc04f234dC7c10758Ef0A9ce6E11368572DB"),
    //             tokenId: 54,
    //             chain: CHAIN_INFO[SupportedChainId.POLYGON].label,
    //             lomadsLink: `https://sbt.lomads.xyz/mint/${"0xeD14Cc04f234dC7c10758Ef0A9ce6E11368572DB"}`,
    //             chainLogo: `https://lomads-dao-development.s3.eu-west-3.amazonaws.com/EmailAssets/${CHAIN_INFO[SupportedChainId.POLYGON].chainName}.png`,
    //             image: "https://lomads-dao-development.s3.eu-west-3.amazonaws.com/SBT/GHzuG21YyuD6i2msMNWE_kGeRJ3JO3ZC.png",
    //             link: `${CHAIN_INFO[SupportedChainId.POLYGON]?.explorer}token/${"0xeD14Cc04f234dC7c10758Ef0A9ce6E11368572DB"}?a=${54}`,
    //             openSea: `${CHAIN_INFO[SupportedChainId.POLYGON]?.opensea}${"0xeD14Cc04f234dC7c10758Ef0A9ce6E11368572DB"}/${54}`,
    //             redirectUrl: "https://www.quantifiedcollective.org/welcome"
    //         } })
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    return (
        <Grid container>
            <Grid item sm={12}>
                <Links />
            </Grid>
            <Grid mt={1} item sm={12}>
                <Notifications isHelpIconOpen={false} />
            </Grid>
            <Grid sm={12}>
                <ProjectSection />
            </Grid>
            <Grid sm={12}>
                <TaskSection onlyProjects={false} />
            </Grid>

            {can(myRole, 'transaction.view') && <Grid mt={1} item sm={12}>
                <Treasury />
            </Grid>}

            <Grid sm={12} sx={{ marginTop: '20px' }}>
                <MembersSection
                    list={_get(DAO, 'members', [])}
                />
            </Grid>
        </Grid>
    )
}