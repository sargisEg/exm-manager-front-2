import { Container } from '@mui/material';
import { NotFound } from 'react-admin';

export const ErrorPage = () => {
    return (
        <Container className='error-page'>
            <NotFound />
        </Container>
    );
}