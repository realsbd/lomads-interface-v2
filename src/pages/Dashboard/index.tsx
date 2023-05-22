import { Box } from "@mui/material";
import { useDAO } from "context/dao";
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Grid } from "@mui/material";

export default () => {
    const { daoURL } = useParams();
    const navigate = useNavigate();
    const { DAO, DAOList } = useDAO();
    return (
        <>
            {
                DAO
                    ?
                    <Box>{DAO.name}</Box>
                    :
                    null
            }
        </>
    )
}