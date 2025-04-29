import { Chip } from '@mui/material';
import { AutocompleteInput } from 'react-admin';
import { useWatch, useController } from 'react-hook-form';
import { ReactComponent as CloseIcon } from '../../assets/images/cross.svg';

const CustomChip = ({ label, handleDelete }: any) => (
    <Chip
        label={label.name}
        onDelete={handleDelete}
        deleteIcon={<CloseIcon className='close-icon-cross'/>}
        color="primary"
        variant="outlined"
        style={{ marginRight: 5 }}
    />
);

export const FilledAutoCompleteInput = ({ placeholder, multiple, isLoading, optionText, regionValue, hideLabel, hideLabelPadding, disabled, defaultValue, fullWidth, choices, label, subLabel, name, isRequired, }: any) => {
    const inputValue = useWatch({ name });
    const input = useController({ name });

    const handleDelete = (option: any) => {
        const newValue = input.field.value.filter((item: any) => item !== option.id);
        input.field.onChange(newValue)
    };

    return (
        <div className={`outlined-select-input ${disabled && 'disabled-select-input'}`} style={fullWidth && { width: '100%' }}>
            {hideLabelPadding ? null : hideLabel ? <p className='label'></p> : <p className='label'>{label ?? 'Country'} {isRequired && <span style={{ color: '#d9214e' }}>*</span>}{subLabel}</p>}
            <div className={`outlined-select-input`}>
                <AutocompleteInput
                    multiple={multiple || false}
                    loading={isLoading ? true : false}
                    style={{ width: '100%' }}
                    defaultValue={defaultValue}
                    optionText={optionText}
                    className={`select-input ${disabled ? 'disabled' : ''}`}
                    disableClearable={multiple ? true : isRequired ? true : false}
                    variant='outlined'
                    source={name}
                    renderTags={multiple ? (value, getTagProps) => {
                        return value.map((option: any, index: any) => (
                            <CustomChip label={option} handleDelete={() => handleDelete(option)} {...getTagProps({ index })} />
                        ))} : undefined
                    }
                    // renderInput={(params: any) => (
                    //     <TextField
                    //       {...params}
                    //       label={!inputValue ? placeholder : ''}
                    //       variant='outlined'
                    //     />
                    //   )}
                    optionValue={regionValue ? regionValue : undefined}
                    label={multiple ? placeholder : inputValue ? false : placeholder}
                    choices={choices}
                />
            </div>
        </div>
    );
}