import {IconButton, ListItemText, MenuItem} from '@mui/material';
import {AppBar, UserMenu, useSidebarState, useUserMenu} from 'react-admin';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';

import {LastPageSharp} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {LogOutDialog} from '../modals/logOutModal';
import {Link} from 'react-router-dom';
import axios from "axios";

const SettingsMenuItem = ({setOpenModal}: { setOpenModal: (open: boolean) => void }) => {
    const {onClose}: any = useUserMenu();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };


    return (
        <div>
            <MenuItem
                onClick={() => {
                    handleNavigation('/profile')
                }}
            >
                <ListItemText style={{padding: '0'}} className='nav-button '>Profile</ListItemText>
            </MenuItem>
            <MenuItem
                onClick={() => {
                    onClose();
                    setOpenModal(true);
                }}
            >
                <ListItemText style={{padding: '0'}} className='nav-button'>Դուրս գալ</ListItemText>
            </MenuItem>
        </div>
    );
};

export const Header = (props: any) => {
    const [open, setOpen] = useSidebarState();
    const [openModal, setOpenModal] = useState(false);

    const [name, setName] = useState(localStorage.getItem('u_n'));
    const [role, setRole] = useState(localStorage.getItem('u_r'));

    useEffect(() => {
        if (name == null || role == null) {
            axios('http://localhost:8088/api/users/v1/me', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Origin": "http://localhost:5000"
                }
            }).then((response: any) => {
                if (response.status < 200 || response.status >= 300 || response.data === '') {
                    throw new Error(response.statusText);
                }
                localStorage.setItem("u_id", response.data.id);
                localStorage.setItem("u_e", response.data.email);
                localStorage.setItem("u_r", response.data.role);
                localStorage.setItem("u_n", response.data.fullName);

                setName(response.data.fullName);
                setRole(response.data.role);
                return response;
            }).catch(err => {
                return err.response;
            })
        }
    }, [name, role]);

    return (
        <>
            <LogOutDialog open={openModal} setOpenModal={setOpenModal}/>

            <AppBar toolbar={<></>} userMenu={
                <div className='nav-top-right'>
                    <div className='rigth-block'>
                        <div className='nav-user-block'>
                            <>
                                <p className='name'>{name}</p>
                                <p className='role'>{role?.toLowerCase()}</p>
                            </>
                        </div>
                        <UserMenu className='user-menu' icon={<DownIcon style={{
                            width: '24px',
                            height: '24px'
                        }} htmlColor='#E1E3EA'/>}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px'
                            }}>
                                <SettingsMenuItem setOpenModal={setOpenModal}/>
                            </div>
                        </UserMenu>
                    </div>
                </div>
            } {...props}>
                <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    width: '220px',
                    justifyContent: 'space-between',
                    padding: '0 15px 0 8px',
                }}>
                    <Link to={"/"}>
                        <span className="text-xl font-bold text-[#f9f9f9]">Exam Management</span>
                    </Link>
                    <IconButton className='sidebar-button' onClick={() => setOpen(!open)}>
                        <LastPageSharp style={{transform: `${open ? 'rotate(180deg)' : 'rotate(0deg)'}`}}/>
                    </IconButton>
                </div>
            </AppBar>
        </>
    )
};
