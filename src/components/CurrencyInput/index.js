import React from "react";
import { Box } from "@mui/material"
import { ReactComponent as DropdownRed } from 'assets/svg/dropdown-red.svg';
import { ReactComponent as DropupRed } from 'assets/svg/dropup-red.svg';
import { ReactComponent as ArrowDown } from "assets/svg/dropdown.svg";
import MenuItem from '@mui/material/MenuItem';
import {
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { makeStyles } from '@mui/styles';
import TextInput from 'components/TextInput';
import IconButton from "components/IconButton";
import { useState } from "react";

import { ReactComponent as PolygonIcon } from 'assets/svg/polygon.svg';

import { useDAO } from "context/dao";
import { useWeb3Auth } from "context/web3Auth";
import { SupportedChainId } from "constants/chains";
import { CHAIN_INFO } from 'constants/chainInfo';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    pickerContainer: {
        width: '100% !important',
        display: 'flex',
        flexDirection: 'row',
        height: '80px',
        '& .chakra-select__icon-wrapper': {
            right: '10px'
        }
    },
    numberInput: {
        background: '#FFFFFF',
        '& input': {
            fontFamily: `'Inter', sans-serif`,
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '18px',
            boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
            textAlign: 'center',
            letterSpacing: '-0.011em',
            color: 'rgba(27, 45, 65, 0.6)'
        }
    },
    select: {
        width: '100%',
        '-webkit-appearance': 'none',
        '-moz-appearance': 'none',
        textIndent: '1px',
        textOverflow: '',
        borderColor: 'rgba(27, 43, 65, 0.1)',
        '&.error': {
            borderColor: '#EA6447'
        }
    }
}));

export default ({ options, onChange, value, dropDownvalue, onDropDownChange, disableCurrency = false, variant = 'primary', errorCurrency, errorProjectValue }) => {
    const classes = useStyles()
    const { DAO } = useDAO();
    const { chainId, account } = useWeb3Auth();

    if (variant === 'primary') {
        return (
            <div className={classes.pickerContainer}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Select
                        disabled={disableCurrency}
                        className={errorCurrency ? clsx(classes.select, 'error') : clsx(classes.select)}
                        defaultValue={dropDownvalue}
                        onChange={e => onDropDownChange(e.target.value)}
                        bg='#F5F5F5'
                        color='#C94B32'
                        variant='unstyled'
                        style={{ borderRadius: '10px 0 0 10px', borderWidth: 1, borderRightWidth: 0, boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)', height: 50, padding: '0px 50px 0px 20px', backgroundColor: '#FFF' }}
                        iconSize={15}
                        icon={<DropdownRed />}
                    >
                        <option value="" selected disabled>Select currency</option>
                        {
                            options && options.map((result, index) => {
                                return (
                                    (
                                        <option value={result?.tokenAddress} key={index}>
                                            {/* {chainId === SupportedChainId.POLYGON ? <PolygonIcon /> : ''}
                                            {_get(result, 'token.symbol', CHAIN_INFO[chainId]?.nativeCurrency?.symbol)} */}
                                            {
                                                result?.token?.symbol
                                            }
                                        </option>
                                    )
                                );
                            })
                        }
                        {/* {_get(DAO, 'sweatPoints', false) && <option value="SWEAT">SWEAT</option>} */}
                    </Select>
                    {errorCurrency && <span style={{ background: '#EA6447', padding: '5px 10px', borderRadius: '0 0 5px 5px', color: '#FFF', textAlign: 'center', width: '90%', fontSize: '11px' }}>Select currency</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={classes.numberInput}>
                        <NumberInput precision={2} step={0.1} min={0} value={value} onChange={e => onChange(e)} defaultValue={0} style={{ width: (100 + 50), height: 50, borderWidth: 1, borderColor: 'rgba(27, 43, 65, 0.1)', borderRightWidth: 0, borderRadius: '10px 0px 0px 10px' }}>
                            <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 100, backgroundColor: '#F5F5F5', borderWidth: 0 }} />
                            <NumberInputStepper style={{ width: 50, backgroundColor: '#FFF', border: '1px solid rgba(27, 43, 65, 0.1)', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)', borderRadius: '0 10px 10px 0', }}>
                                <NumberIncrementStepper color="#C94B32" children={<DropupRed />} />
                                <NumberDecrementStepper color="#C94B32" children={<DropdownRed />} style={{ borderTopWidth: 0 }} />
                            </NumberInputStepper>
                        </NumberInput>
                    </div>
                    {errorProjectValue && <span style={{ background: '#EA6447', padding: '5px 10px', borderRadius: '0 0 5px 5px', color: '#FFF', textAlign: 'center', width: '90%', fontSize: '11px' }}>Cannot be 0</span>}
                </div>
            </div>
        )
    }

    else {
        return (
            <div className={classes.pickerContainer}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={classes.numberInput}>
                        <NumberInput precision={2} step={0.1} min={0} value={value} onChange={e => onChange(e)} defaultValue={0} style={{ width: (100 + 50), height: 50, borderWidth: 1, borderColor: 'rgba(27, 43, 65, 0.1)', borderRightWidth: 0, borderRadius: '10px 0px 0px 10px' }}>
                            <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 100, backgroundColor: '#F5F5F5', borderWidth: 0 }} />
                            <NumberInputStepper style={{ width: 50, backgroundColor: '#FFF', border: '1px solid rgba(27, 43, 65, 0.1)', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)', borderRadius: '0 10px 10px 0', }}>
                                <NumberIncrementStepper color="#C94B32" children={<DropupRed />} />
                                <NumberDecrementStepper color="#C94B32" children={<DropdownRed />} style={{ borderTopWidth: 0 }} />
                            </NumberInputStepper>
                        </NumberInput>
                    </div>
                    {errorProjectValue && <span style={{ background: '#EA6447', padding: '5px 10px', borderRadius: '0 0 5px 5px', color: '#FFF', textAlign: 'center', width: '90%', fontSize: '11px' }}>Cannot be 0</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Select
                        disabled={disableCurrency}
                        className={errorCurrency ? clsx(classes.select, 'error') : clsx(classes.select)}
                        defaultValue={dropDownvalue}
                        onChange={e => onDropDownChange(e.target.value)}
                        bg='#F5F5F5'
                        color='#C94B32'
                        variant='unstyled'
                        style={{ borderRadius: '10px 0 0 10px', borderWidth: 1, borderRightWidth: 0, borderColor: 'rgba(27, 43, 65, 0.1)', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)', height: 50, padding: '0px 50px 0px 20px', backgroundColor: '#FFF' }}
                        iconSize={15}
                        icon={<DropdownRed />}
                    >
                        <option value="" selected disabled>Select currency</option>
                        {
                            options && options.map((result, index) => {
                                return (
                                    (
                                        <option value={result?.tokenAddress} key={index}>
                                            {
                                                result?.token?.symbol
                                            }
                                        </option>
                                    )
                                );
                            })
                        }
                        {/* {_get(DAO, 'sweatPoints', false) && <option value="SWEAT">SWEAT</option>} */}
                    </Select>
                    {errorCurrency && <span style={{ background: '#EA6447', padding: '5px 10px', borderRadius: '0 0 5px 5px', color: '#FFF', textAlign: 'center', width: '90%', fontSize: '11px' }}>Select currency</span>}
                </div>
            </div>
        )
    }

}