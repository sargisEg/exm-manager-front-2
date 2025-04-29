import {
    SimpleForm,
    SaveButton,
    Toolbar,
    Edit,
} from 'react-admin';
import { Button } from '@mui/material';
import BackIcon from '@mui/icons-material/KeyboardBackspace';
import CloseIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

export const EditModal = ({ resource, id, onSuccess, handleClose, children, warnWhenUnsavedChanges }: any) => {
    const navigate = useNavigate();

    const PostSaveButton = (props: any) => {
        return <SaveButton className='button-save' {...props} />;
    };

    const PostEditToolbar = () => {
        return (
            <Toolbar>
                <PostSaveButton />
            </Toolbar>
        )
    };

    return (
        <Edit
            id={id} mutationMode='optimistic'
            mutationOptions={{ onSuccess }}
            sx={{ width: 500, '& .RaCreate-main': { mt: 0 } }}
        >
            <SimpleForm className='modal-edit-create' warnWhenUnsavedChanges toolbar={<PostEditToolbar />}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <Button className='resource-button' onClick={() => navigate(-1)}><BackIcon style={{ fontSize: '30px' }} /></Button>
                    <div className='resource-circle'>
                        <p className='resource-title'>{resource}</p>
                    </div>
                    <Button className='resource-button' onClick={handleClose}><CloseIcon htmlColor='#D9214E' style={{ fontSize: '30px' }} /></Button>
                </div>
                {children}
            </SimpleForm>
        </Edit>
    );
}
