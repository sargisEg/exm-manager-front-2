import { ReactComponent as NotFoundIcon } from '../assets/images/not-found-apps.svg';
import { ReactComponent as EmptyIcon } from '../assets/images/empty.svg';
import { ReactComponent as NoAdressesIcon } from '../assets/images/no-addresses.svg';

export const NotFoundResults = ({ resource, name }: any) => {
    return (
        <div className='empty-body not-found'>
            <div className='image-block'>
                {/* {resource === 'addresses' ? <NoAdressesIcon /> : */}
                <NotFoundIcon />
                {/* } */}
            </div>
            <p className='note-empty'>No results found</p>
            <p className='note-empty-sub'>We could’t find any {name} matching your search.</p>
        </div>
    )
}

export const EmptyPage = ({ resource, name }: any) => {
    return (
        <div className='empty-body not-found'>
            <div className='image-block'>
                {resource === 'addresses' ? <NoAdressesIcon /> :
                    <EmptyIcon />}
            </div>
            <p className='note-empty'>{resource === 'sessions' ? 'There are no active sessions' : `You haven’t added any ${name} yet.`}</p>
            {resource === 'sessions' &&
                <p className='note-empty-sub'>No members connected at this time.</p>
            }
        </div>
    )
}