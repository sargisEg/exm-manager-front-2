import { useEffect } from 'react';
import {
    TextInput,
    required,
} from 'react-admin';
import { useController } from 'react-hook-form';

export const FilledNumberInput = ({ className, defaultValue, fullWidth, label, name, isRequired, placeholder, subLabel }: any) => {
    const fieldPort = useController({ name: 'port', defaultValue: 3389 });

    useEffect(() => {
        if (name === 'port') {
            fieldPort.field.onChange(defaultValue)
        }
        // eslint-disable-next-line
    }, [defaultValue]);

    return (
        <TextInput
            parse={(v) => {
                if (name === 'port') {
                    if (v > 65535) {
                        return v.slice(0, -1);
                    }
                    return v.replace(/[^0-9]/g, '')
                }
                return v.replace(/[^0-9]/g, '')
            }}
            style={fullWidth && { width: '100%' }}
            label={label ? <div className='label'>{label} <span style={{ color: '#D9214E' }}>*</span>{subLabel}</div> : false}
            className={`outlined-input ${className ? className : ''}`}
            InputLabelProps={{ shrink: true }}
            placeholder={placeholder}
            variant='outlined'
            validate={isRequired ? required() : undefined}
            fullWidth
            source={name}
        />
    );
}
