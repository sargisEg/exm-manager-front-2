import {Menu, useSidebarState} from 'react-admin';

import {useMediaQuery} from '@mui/material';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppsSharp as DashIcon, Book, CalendarMonth, Groups, ImportContacts, HistoryEdu, Person} from '@mui/icons-material'
import SubMenu from "../util/subMenu";
import axios from "axios";
import {api} from "../shared/api";
import {GroupResponse} from "../shared/models";

export const MySidebar = () => {
    const [open] = useSidebarState();
    const [, setOpen] = useSidebarState();
    const isSmall = useMediaQuery('(max-width:750px)');
    const navigate = useNavigate();
    const [role, setRole] = useState(localStorage.getItem('u_r'));
    const [academicYear, setAcademicYear] = useState<string | null>(localStorage.getItem('a_y'));

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        if (isSmall) {
            setOpen(false);
        } else {
            setOpen(true);
        }
        if (role == null) {
            axios('http://localhost:8088/api/users/v1/me', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("u_t")}`,
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

                setRole(response.data.role);
                return response;
            }).catch(err => {
                return err.response;
            })
        }
        if (!academicYear && role === "STUDENT") {
            api.get<GroupResponse>(`core/v1/groups/me`)
                .then((response) => {
                    setAcademicYear('' + response.data.academicYear);
                    localStorage.setItem("a_y", '' + response.data.academicYear);
                })
        }
    }, [academicYear, isSmall, role, setOpen]);

    return (
        <>
            {role === 'STUDENT' &&
                <Menu className='sideBar-block'>
                    <Menu.Item to='/student/dashboard' onClick={(e) => {
                        e.preventDefault()
                        handleNavigation('/student/dashboard')
                    }} primaryText={open ? 'Ցուցատախտակ' : ''} leftIcon={<DashIcon className="scale-150"/>}/>
                    <SubMenu primaryText='Առարկաներ' leftIcon={<Book/>}>
                        {[...Array(parseInt(academicYear ? academicYear : '1'))].map((_, i) => (
                            <Menu.Item to={'/student/courses/' + (i+1)} onClick={(e) => {
                                e.preventDefault()
                                handleNavigation('/student/courses/' + (i+1))
                            }} primaryText={open ? i > 3 ? 'Մագիստրատուրա ' + (i-3) : 'Բակալավր ' + (i+1) : ''}/>
                        ))}
                    </SubMenu>
                    <Menu.Item to='/student/exams' onClick={(e) => {
                        e.preventDefault()
                        handleNavigation('/student/exams')
                    }} primaryText={open ? 'Քննություններ' : ''} leftIcon={<HistoryEdu/>}/>
                </Menu>
            }
            {role === 'TEACHER' &&
                <Menu className='sideBar-block'>
                    <Menu.Item to='/teacher/courses' onClick={(e) => {
                        e.preventDefault()
                        handleNavigation('/teacher/courses')
                    }} primaryText={open ? 'Առարկաներ' : ''} leftIcon={<ImportContacts/>}/>
                    <Menu.Item to='/teacher/calnedar' onClick={(e) => {
                        e.preventDefault()
                        handleNavigation('/teacher/calendar')
                    }} primaryText={open ? 'Օրացույց' : ''} leftIcon={<CalendarMonth/>}/>
                    <Menu.Item to='/teacher/groups' onClick={(e) => {
                        e.preventDefault()
                        handleNavigation('/teacher/groups')
                    }} primaryText={open ? 'Խմբեր' : ''} leftIcon={<Groups/>}/>
                </Menu>
            }
            {role === 'ADMIN' &&
                <Menu className='sideBar-block'>
                    <Menu.Item to='/admin/groups' onClick={(e) => {
                        e.preventDefault()
                        handleNavigation('/admin/groups')
                    }} primaryText={open ? 'Խմբեր' : ''} leftIcon={<Groups/>}/>
                    <Menu.Item to='/admin/teachers' onClick={(e) => {
                        e.preventDefault()
                        handleNavigation('/admin/teachers')
                    }} primaryText={open ? 'Դասախոսներ' : ''} leftIcon={<Person/>}/>
                </Menu>
            }
        </>
    )
};