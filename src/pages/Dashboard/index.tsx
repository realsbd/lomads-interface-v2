import { useDAO } from "context/dao";
import React from "react"
import { useNavigate, useParams } from "react-router-dom"

export default () => {
    const { daoURL } = useParams();
    const navigate = useNavigate();
    const { DAO, DAOList } = useDAO();
    return (
        DAO ?
    <div onClick={() => navigate(`/${daoURL}/project`)}>
        go
    </div> : null )
}