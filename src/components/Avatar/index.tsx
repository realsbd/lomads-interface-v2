import React, { useState, useEffect } from 'react';
import { get as _get } from 'lodash';
import Avatar from "boring-avatars";
import { Box, Typography } from '@mui/material';


export default ({ name, wallet, hideDetails, ...props }: any) => {

    return (
        <Box style={{ display: 'flex', width: '100%', position: 'relative' }}>
            {/* <Box style={{ height: 40, width: 40, borderRadius: '50%', backgroundColor: '#FFF', boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)' }} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <Avatar
                    size={32}
                    name={wallet}
                    variant="marble"
                    colors={["#E67C40", "#EDCD27", "#8ECC3E", "#2AB87C", "#188C8C"]}
                />
            </Box> */}
            <Avatar
                size={32}
                name={wallet}
                variant="marble"
                colors={["#E67C40", "#EDCD27", "#8ECC3E", "#2AB87C", "#188C8C"]}
            />
            {name && <Box style={{ height: 32, width: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0 }} >
                <Typography sx={{ color: '#FFF', fontWeight: 500 }}>ZK</Typography>
            </Box>}
            {
                !hideDetails &&
                <Box style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    {
                        name && <Typography style={{ color: '#1b2b41', fontWeight: '700', fontSize: '12px', margin: '0' }}>{name}</Typography>
                    }
                    <Typography style={{ color: '#1b2b41', fontWeight: '400', fontSize: '12px', margin: '0' }}>{wallet.slice(0, 6) + "..." + wallet.slice(-4)}</Typography>
                </Box>
            }
        </Box>
    )
}
