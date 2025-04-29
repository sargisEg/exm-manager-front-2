import {
    required,
    SelectInput,
} from 'react-admin';
import { useWatch } from 'react-hook-form';

export const FilledSelectInput = ({ hidePlaceholder, value, customOnChange, optionText, disabled, disableMargin, defaultValue, policyTime, className, fullWidth, label, subLabel, name, isRequired, placeholder, choices }: any) => {
    const inputValue = useWatch({ name });
    const optionRenderer = (choice: any) => <p>{choice.name}</p>;

    return (
        <div className={`outlined-select-input ${policyTime && 'policy-time'} ${disabled && 'disabled-select-input'} ${disableMargin && 'disableMargin'}`} style={fullWidth && { width: '100%' }}>
            {label && <div className='label'>{label}{isRequired && <span style={{ color: '#D9214E' }}>
                {(name === 'security' || name === 'windowsUpgradetype' || name === 'macUpgradetype'
                    || name === 'linuxUpgradetype') ? '' : '*'}</span>}{subLabel}</div>}
            <SelectInput
                onChange={customOnChange && customOnChange}
                optionText={optionText ? optionText : optionRenderer}
                InputLabelProps={{ shrink: false }}
                defaultValue={defaultValue ? defaultValue : null}
                style={fullWidth && { width: '100%' }}
                className={`select-input ${className && className}`}
                variant='outlined'
                id='dropdown'
                resettable={(defaultValue || disabled || isRequired) ? false : true}
                validate={isRequired ? required() : undefined}
                source={name}
                value={value}
                label={hidePlaceholder ? placeholder : (inputValue || defaultValue) ? false : placeholder}
                choices={choices ? choices : undefined}
            />
        </div>
    );
}
