import { Box } from "@mui/material";
import { useDAO } from "context/dao";
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Grid } from "@mui/material";
import ProjectSection from "sections/ProjectSection";
import TaskSection from "sections/TaskSection";

export default () => {
    const { daoURL } = useParams();
    const navigate = useNavigate();
    const { DAO, DAOList } = useDAO();
    return (
        <>
            {
                DAO
                    ?
                    <>
                        <Box sx={{ width: '100%', marginBottom: '20px' }}>
                            <TaskSection />
                        </Box>
                        <Box sx={{ width: '100%', marginBottom: '20px' }}>
                            <ProjectSection />
                        </Box>
                    </>
                    :
                    null
            }
        </>
    )
}