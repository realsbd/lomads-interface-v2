import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import CHECKBOX_UNCHECKED from '../../assets/svg/checkbox-unchecked.svg'
import CHECKBOX_CHECKED from '../../assets/svg/checkbox-checked.svg'

interface CheckboxProps {
    checked?: boolean;
}

export default ({ checked }: CheckboxProps) => {
    return (
        <Checkbox checked={checked} icon={<img src={CHECKBOX_UNCHECKED} />} checkedIcon={<img src={CHECKBOX_CHECKED} />} />
    )
}