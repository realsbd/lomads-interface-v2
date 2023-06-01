import React from "react"
import { Drawer, Box } from "@mui/material"

export default ({ open, onClose }: any) => {
    return (
        <Drawer
            PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
            sx={{ zIndex: 99999 }}
            anchor={'right'}
            open={open}
            onClose={() => onClose()}>
                <Box sx={{ width: '575px', flex: 1, padding: '32px 72px 32px 72px', borderRadius: '20px 0px 0px 20px' }}>
                    
                </Box>
        </Drawer>
    )
}