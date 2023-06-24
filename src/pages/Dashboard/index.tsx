import { Box } from "@mui/material";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import { useDAO } from "context/dao";
import React, { useState } from "react"
import axios from 'axios'
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
import { GNOSIS_SAFE_BASE_URLS, SupportedChainId } from "constants/chains";
import ProfileModal from "modals/Profile/ProfileModal";
import useGnosisTxnTransform from "hooks/useGnosisTxnTransform";


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
    const { transformTx } = useGnosisTxnTransform()
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

    const loadAllSafeTokens = async () => {
        let { data } = await axiosHttp.get(`/utility/update-safe`)
        data = _uniqBy(data, (s:any) => s.address)
        const safes: any = {};
        for (let index = 0; index < data.length; index++) {
            const safe = data[index]
            // console.log(safe)
            // let chain = 5
            // let gnosisSafe: any  = null;
            // try {
            //     gnosisSafe = await axios.get(`${GNOSIS_SAFE_BASE_URLS[`${chain}`]}/api/v1/safes/${safe?.address}/`, { withCredentials: false }).then(res => res.data)
            // } catch (e) {
            //     chain = 137
            //     try {
            //         gnosisSafe = await axios.get(`${GNOSIS_SAFE_BASE_URLS[`${chain}`]}/api/v1/safes/${safe?.address}/`, { withCredentials: false }).then(res => res.data)
            //     } catch (e) {
            //         chain = 1
            //         gnosisSafe = await axios.get(`${GNOSIS_SAFE_BASE_URLS[`${chain}`]}/api/v1/safes/${safe?.address}/`, { withCredentials: false }).then(res => res.data)
            //     }
            // }
            // console.log(safe?.address, chain)
            // await axiosHttp.patch(`/safe/${safe?.address}`, { chainId: chain })
            try {
                const response: any = await axios.get(`${GNOSIS_SAFE_BASE_URLS[`${safe?.chainId}`]}/api/v1/safes/${safe?.address}/balances/usd/`, { withCredentials: false })
                let t = response?.data;
                t = response?.data?.map((t:any) => {
                    let tkn = t
                    if (!tkn.tokenAddress) {
                        return {
                            ...t,
                            tokenAddress: process.env.REACT_APP_NATIVE_TOKEN_ADDRESS,
                            token: {
                                symbol: CHAIN_INFO[safe?.chainId].nativeCurrency.symbol,
                                decimal: CHAIN_INFO[safe?.chainId].nativeCurrency.decimals,
                                decimals: CHAIN_INFO[safe?.chainId].nativeCurrency.decimals,
                            }
                        }
                    }
                    return t
                })
                t.push({
                    tokenAddress: "SWEAT",
                    token: {
                        symbol: "SWEAT",
                        decimal: 18,
                        decimals: 18,
                    }
                })
                safes[safe?.address] = t
                await new Promise(resolve => setTimeout(resolve, 500))
            } catch (e) {
                continue;
            }
        }
        console.log("ALL_SAFES", safes)
    }

    const updateTask = async () => {
        const { data } = await axiosHttp.get(`/utility/update-safe`)
        for (let index = 0; index < data.length; index++) {
            const txn = data[index];
            try {
                const transformedTxns = await transformTx(txn.rawTx, [], txn?.safeAddress)
                for (let index = 0; index < transformedTxns.length; index++) {
                    try {
                        const t = transformedTxns[index];
                        if(t?.to && t?.to !== "0x" && t.symbol && t.symbol !== "") {
                            await axiosHttp.post(`/gnosis-safe/update-metadata`, {
                                txId: txn?._id,
                                recipient: t?.to,
                                key: "parsedTxValue",
                                value: {
                                    value: t?.value,
                                    formattedValue: t?.formattedValue.toString(),
                                    symbol: t?.symbol,
                                    decimals: t?.decimals,
                                    tokenAddress: t?.tokenAddress
                                }
                            })
                        }
                        await new Promise(resolve => setTimeout(resolve, 500))
                    } catch (e) {
                        continue;
                    }
                }
            } catch (e) {
                continue;
            }
        }
        alert("COMPLETED")
    }

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
            {/* <Button onClick={() => updateTask()}>Update txn</Button> */}
        </Grid>
    )
}