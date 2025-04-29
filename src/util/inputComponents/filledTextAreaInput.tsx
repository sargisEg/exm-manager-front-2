import { TextareaAutosize } from '@mui/material';
import { useController } from 'react-hook-form';

import { AdminToolTip } from '../adminTooltip';
import { ReactComponent as UploadIcon } from '../../assets/images/upload.svg';
import { useRef, useState } from 'react';

export const FilledTextAreaInput = ({ name, placeholder }: any) => {
    const fileInputRef = useRef<any>(null);
    const [customError, setError] = useState<any>(null);
    const textAreaInputValue: any = useController({ name: name });

    const handleFileUpload = (event: any) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.pem')) {
            setError(null)
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const fileContents = e.target.result;
                textAreaInputValue.field.onChange(fileContents)
            };
            reader.readAsText(selectedFile);
        } else {
            textAreaInputValue.field.onChange('')
            setError('Invalid file type. Please select a .pem file.')
        }
    };

    const handleClick = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    };

    return (
        <div className='outlined-select-input'>
            <div className='label' style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <input type='file' accept='.pem' onChange={handleFileUpload} ref={fileInputRef} style={{ display: 'none' }} />
                <div className='label'>
                    <span>Prvate Key</span>
                    <span style={{ color: '#D9214E' }}>*</span>
                    <div style={{ display: 'inline-block' }}><AdminToolTip left='-104px' top='-188px' title='The private key used for public key authentication must be provided in its entirety. If you omit this parameter, public key authentication won’t be enabled. Ensure that the private key is in the OpenSSH format, similar to what the OpenSSH ssh-keygen utility generates.' /></div>
                </div>
                <p className='upload-file' onClick={handleClick}>Upload PEM File <UploadIcon /></p>
            </div>
                <TextareaAutosize minRows={6} maxRows={6} placeholder={placeholder} onChangeCapture={() => customError && setError(null)} {...textAreaInputValue.field} className={`text-area ${textAreaInputValue.fieldState.error ? 'text-area-error' : ''}`} />
            <p style={{
                color: '#D9214E',
                fontWeight: '500',
                lineHeight: '14px',
                fontSize: '0.75rem',
            }}>{customError || (textAreaInputValue.fieldState.error && textAreaInputValue.fieldState.error?.message?.hasOwnProperty('message') ?
                textAreaInputValue.fieldState.error?.message['message'] : textAreaInputValue.fieldState.error?.message)}</p>
        </div>
    );
};