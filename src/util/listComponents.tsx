import { InputAdornment } from '@mui/material';
import { Filter, Pagination, TextInput } from 'react-admin';
import { ReactComponent as SearchIcon } from '../assets/images/search.svg';

export const PostPagination = (props: any) => <Pagination rowsPerPageOptions={[25, 50, 100, 500]} {...props} />;

export const ListTopBar = ({ resource, hideSub, showAvailableTopPart, availableMessageTopPart, hideOnlySearch, hideLearnMore, updateApplicationMessage, filter, exportButton, hideSearch, message, showAvailable, availableMessage, actions }: any) => {
    return (
        <div className='list-toolbar'>
            <div className='top-bar-add-application'>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}>
                    <p className='top-bar-title'>{resource}</p>
                    {message &&
                        <p style={{ visibility: hideSub ? 'hidden' : 'visible' }} className='top-bar-sub-title'>{message}{hideLearnMore ? null : <span>Learn More</span>}</p>
                    }
                </div>
                {availableMessageTopPart ?
                    showAvailableTopPart ?
                        <p style={{
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'center'
                        }}>{availableMessageTopPart}: <span>{showAvailableTopPart}</span></p>
                        : <p className='available-app-block'></p> : ''}
                {actions}
            </div>
            {hideSearch ? null :
                <div className='reached-progress-block'>
                    {updateApplicationMessage}
                    {filter ? filter :
                        <div className='filter-available-block'>
                            {hideOnlySearch ? null :
                                <div className='input-filter-block'>
                                    <Filter>
                                        <TextInput
                                            alwaysOn
                                            label={<></>}
                                            className='outlined-input filter-text-input'
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            resettable
                                            InputLabelProps={{ shrink: true }}
                                            placeholder='Search'
                                            variant='outlined'
                                            fullWidth
                                            source='search'
                                        />
                                    </Filter>
                                </div>
                            }
                            {exportButton &&
                                exportButton
                            }
                            {availableMessage ?
                                showAvailable ?
                                    <p className='available-app-block'>{availableMessage}: <span>{showAvailable}</span></p>
                                    : <p className='available-app-block'></p> : ''}
                        </div>
                    }
                </div>
            }
        </div>
    )
}