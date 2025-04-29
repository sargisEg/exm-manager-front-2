import * as React from 'react';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Collapse } from '@mui/material';
import { useSidebarState } from 'react-admin';
import { useLocation } from 'react-router';

import { ArrowUpward as DownArrowIcon } from '@mui/icons-material';
import { ArrowDownward as TopArrowIcon } from '@mui/icons-material';

export const SubMenu = (props: any) => {
    const { name, primaryText, leftIcon, children } = props;
    const [open, setOpen] = useSidebarState();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState<any>(null);

    const handleToggle = (value: any) => {
        if (isOpen.includes(value)) {
            setIsOpen((prevItems: any) => prevItems.filter((item: any) => item !== value));
            setCurrentPage(null)
        } else {
            setIsOpen((oldArray: any) => [...oldArray, value]);
        }
        setOpen(true)
    };

    useEffect(() => {
        if (location.pathname.includes('application')) {
            setCurrentPage('application');
            setIsOpen((oldArray: any) => [...oldArray, 'application']);
        } else if (location.pathname.includes('users')) {
            setCurrentPage('teams');
            setIsOpen((oldArray: any) => [...oldArray, 'teams']);
        } else if (location.pathname.includes('dashboard')) {
            setCurrentPage('dashboard');
            setIsOpen((oldArray: any) => [...oldArray, 'dashboard']);
        }
    }, [location])

    return (
        <React.Fragment>
            <ListItem
                dense
                onClick={() => handleToggle(name)}
                className={currentPage === name ? 'active' : ''}
            >
                {leftIcon}
                <ListItemText
                    inset
                    disableTypography
                    primary={open ? primaryText : ''}
                    sx={{
                        paddingLeft: 2,
                        fontSize: '1rem',
                        color: 'rgba(0, 0, 0, 0.6)',
                    }}
                />
                {isOpen.includes(name) ? <DownArrowIcon className='expandMore' /> : <TopArrowIcon className='expand' />}
            </ListItem>
            <Collapse in={isOpen.includes(name) ? true : false} timeout='auto' unmountOnExit>
                <List
                    component='div'
                    disablePadding
                >
                    {children}
                </List>
            </Collapse>
        </React.Fragment>
    )
}

export type SubMenuProps = {
    children?: React.ReactNode;
    isDropdownOpen?: boolean;
    leftIcon?: React.ReactElement;
    primaryText?: string;
};

export default SubMenu;