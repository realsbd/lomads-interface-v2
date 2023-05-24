import React, { useState, useEffect } from 'react';
import { get as _get } from 'lodash';
import Avatar from "boring-avatars";
import { Box, Typography } from '@mui/material';


export default ({ name, wallet, hideDetails, ...props }: any) => {

    var getInitials = function (value: string) {
        var names = value.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    return (
        <Box style={{ display: 'flex', width: '100%', position: 'relative' }}>
            <Avatar
                size={32}
                name={wallet}
                variant="marble"
                colors={["#E67C40", "#EDCD27", "#8ECC3E", "#2AB87C", "#188C8C"]}
            />
            {name && <Box style={{ height: 32, width: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0 }} >
                <Typography sx={{ color: '#FFF', fontWeight: 500 }}>{getInitials(name)}</Typography>
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
