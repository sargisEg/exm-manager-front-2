import { useState } from 'react';
import { required, useTranslate } from 'ra-core';
import { InputAdornment, IconButton } from '@mui/material';

import { ReactComponent as Visibility } from '../assets/images/show.svg';
import { ReactComponent as VisibilityOff } from '../assets/images/hide.svg';
import { PasswordInputProps, TextInput } from 'react-admin';

export const CustomPasswordInput = (props: PasswordInputProps) => {
    const { initiallyVisible = false, ...rest } = props;
    const [visible, setVisible] = useState(initiallyVisible);
    const translate = useTranslate();

    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <TextInput
            type={visible ? 'text' : 'password'}
            size='small'
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label={translate(
                                visible
                                    ? 'ra.input.password.toggle_visible'
                                    : 'ra.input.password.toggle_hidden'
                            )}
                            onClick={handleClick}
                            size='large'
                        >
                            {visible ? <Visibility className='pass-icon' style={{ width: '20px', height: '20px' }} /> :
                                <VisibilityOff className='pass-icon' style={{ width: '20px', height: '20px' }} />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...rest}
        />
    );
};

export const FilledPasswordInput = ({ customInputTrigger, icon, className, defaultValue, fullWidth, label, name, isRequired, placeholder, subLabel }: any) => {
    const [visible, setVisible] = useState(false);

    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <TextInput
            type={visible ? 'text' : 'password'}
            className={`outlined-input ${className ? className : ''}`}
            style={fullWidth && { width: '100%' }}
            label={label ? <div className='label'>{label} {isRequired && <span style={{ color: '#D9214E' }}>*</span>}{subLabel}</div> : false}
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton
                            onClick={handleClick}
                            size='large'
                        >
                            {visible ? <Visibility className='pass-icon' style={{ width: '20px', height: '20px' }} /> :
                                <VisibilityOff className='pass-icon' style={{ width: '20px', height: '20px' }} />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            defaultValue={defaultValue}
            InputLabelProps={{ shrink: true }}
            placeholder={placeholder}
            variant='outlined'
            validate={isRequired ? required() : undefined}
            fullWidth
            source={name}
        />
    );
}
