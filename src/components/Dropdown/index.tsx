import React, { useState } from 'react';
import { Select, MenuItem, FormControl } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface DropdownProps {
    options?: any[],
    placeholder?: string,
    onChange(action: any): void;
}

export default ({ options, onChange, placeholder }: DropdownProps) => {
    const [val, setVal] = useState(options?.[0]);

    const handleChange = (event: any) => {
        setVal(event.target.value);
        onChange(event.target.value);
    };

    const minimalSelectClasses = {
        select: {
            minWidth: 200,
            background: 'red !important',
            color: 'red',
            fontWeight: 200,
            borderStyle: 'none',
            borderWidth: 2,
            borderRadius: 12,
            paddingLeft: 24,
            paddingTop: 14,
            paddingBottom: 15,
            boxShadow: '0px 5px 8px -3px rgba(0,0,0,0.14)',
            "&:focus": {
                borderRadius: 12,
                background: 'white',
                borderColor: 'red'
            },
        },
        icon: {
            color: 'red',
            right: 12,
            position: 'absolute',
            userSelect: 'none',
            pointerEvents: 'none'
        },
        paper: {
            borderRadius: 12,
            marginTop: 8
        },
        list: {
            paddingTop: 0,
            paddingBottom: 0,
            background: 'white',
            "& li": {
                fontWeight: 200,
                paddingTop: 12,
                paddingBottom: 12,
            },
            "& li:hover": {
                background: 'red !important'
            },
            "& li.Mui-selected": {
                color: 'white',
                background: 'red'
            },
            "& li.Mui-selected:hover": {
                background: 'red'
            }
        }
    }

    const iconComponent = (props: any) => {
        return (
            <ExpandMoreIcon className={props.className + " " + minimalSelectClasses.icon} />
        )
    };

    const menuProps = {
        classes: {
            paper: minimalSelectClasses.paper,
            list: minimalSelectClasses.list
        },
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "left"
        },
        getContentAnchorEl: null
    };

    return (
        <FormControl sx={{ width: '100%' }}>
            <Select
                // classes={{ root: minimalSelectClasses.select }}
                // MenuProps={menuProps}
                // IconComponent={iconComponent}
                value={val}
                onChange={handleChange}
                displayEmpty
                renderValue={val !== "" ? undefined : () => placeholder}
            >
                {
                    options?.map((_option, _index) => {
                        return (
                            <MenuItem value={_option}>{_option}</MenuItem>
                        )
                    })
                }
            </Select>
        </FormControl>
    );
};
