import {
    TextInput,
    required,
} from 'react-admin';
import { IconButton, InputAdornment } from '@mui/material';
import { useWatch } from 'react-hook-form';

import { ReactComponent as LogoTwoFaPhone } from '../../assets/images/twoFaPhone.svg';
import { ReactComponent as Visibility } from '../../assets/images/show.svg';
import { ReactComponent as VisibilityOff } from '../../assets/images/hide.svg';
import { ReactComponent as SearchIcon } from '../../assets/images/search.svg';
import { useState } from 'react';

export const FilledInput = ({ isDisabled, placeholderAsterisk, noLable, format, customInputTrigger, endIcon, icon, className, defaultValue, fullWidth, label, name, isRequired, placeholder, twoFa, subLabel }: any) => {
    const inputValue = useWatch({ name });
    const [visible, setVisible] = useState(endIcon ? false : true);
    const [focus, setFocus] = useState(false);

    const dayFormat = (value: any) => {
        if (/^[0-9]+$/.test(value)) {
            if (value.length > 3) {
                return value.slice(0, -1);
            }
            return value;
        }
    };

    const handleClick = () => {
        setVisible(!visible);
    };

    const handlePaste = (event: any) => {
        event.target.blur();
        event.target.focus();
    };


    return (
        <TextInput
            onPaste={handlePaste}
            parse={(e: any) => {
                if (format) {
                    return dayFormat(e);
                }
                return e;
            }}
            onFocus={(e: any) => {
                if (placeholderAsterisk) {
                    setFocus(true);
                }
            }}
            onBlur={() => {
                if (placeholderAsterisk) {
                    setFocus(false);
                }
            }}
            type={visible ? 'text' : 'password'}
            className={`outlined-input ${noLable ? 'hide-input-label' : ''} ${className ? className : ''} ${isDisabled ? 'disabled' : ''}`}
            style={fullWidth && { width: '100%' }}
            label={label ? <div className='label'>{label} {isRequired && <span style={{ color: '#D9214E' }}>*</span>}{subLabel}</div> : <div style={{ height: noLable ? '0' : '14px' }} className='label'></div>}
            InputProps={icon ? {
                startAdornment: (
                    <InputAdornment position='start'>
                        <SearchIcon />
                    </InputAdornment>
                ),
            } : endIcon ? {
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton
                            style={{ padding: '0' }}
                            onClick={handleClick}
                            size='large'
                        >
                            {visible ? <Visibility className='pass-icon' style={{ width: '20px', height: '20px' }} /> :
                                <VisibilityOff className='pass-icon' style={{ width: '20px', height: '20px' }} />}
                        </IconButton>
                    </InputAdornment>
                )
            } : twoFa ? {
                startAdornment: (
                    <InputAdornment position='start'>
                        <LogoTwoFaPhone />
                    </InputAdornment>
                )
            } : placeholderAsterisk ?
                {
                    startAdornment: (
                        focus || inputValue ? <div></div> : <div className='custom-placeholder-asterisk'>{placeholder}<span>*</span></div>
                    ),
                }
                : {}}
            defaultValue={defaultValue}
            InputLabelProps={{ shrink: true }}
            placeholder={placeholderAsterisk ? undefined : placeholder}
            onInput={(e: any) => {
                if (customInputTrigger) {
                    e.target.blur();
                    e.target.focus();
                }
            }}
            variant='outlined'
            validate={isRequired ? required() : undefined}
            fullWidth
            source={name}
        />
    );
}
