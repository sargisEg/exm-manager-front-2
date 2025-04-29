import {Card, CardContent, CardHeader, CardTitle} from "../../components/card";
import {Apartment, GroupAdd, GroupRemove, PersonRemove, Add, Clear, LockReset, PersonAddAlt1} from '@mui/icons-material'
import {ExpandMore} from "@mui/icons-material";
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react'
import {Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper} from '@mui/material'
import {Button} from "../../components/button";
import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {api} from "../../shared/api";
import {
    CourseResponse,
    CreateGroupRequest, CreateStudentRequest,
    GroupResponse,
    StudentResponse,
    SubgroupResponse
} from "../../shared/models";
import LoadingPage from "../loading";
import {CreateSubgroupModal} from "../../modals/createSubgroupModal";
import {DeleteSubgroupModal} from "../../modals/deleteSubgroupModal";
import CreateStudentModal from "../../modals/createStudentModal";
import {DeleteStudentModal} from "../../modals/deleteStudentModal";
import {DeleteCourseModal} from "../../modals/deleteCourseModal";
import CreateCourseModal from "../../modals/createCourseModal";

export default function AdminGroupDetails() {
    const {groupId} = useParams();
    const [loading, setLoading] = useState(false);

    const [createSubgroupModalOpen, setCreateSubgroupModalOpen] = useState(false);
    const [deleteSubgroupModalOpen, setDeleteSubgroupModalOpen] = useState(false);
    const [createStudentModalOpen, setCreateStudentModalOpen] = useState(false);
    const [deleteStudentModalOpen, setDeleteStudentModalOpen] = useState(false);
    const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
    const [deleteCourseModalOpen, setDeleteCourseModalOpen] = useState(false);

    const [group, setGroup] = useState<GroupResponse>();
    const [courses, setCourses] = useState<CourseResponse[]>();
    const [students, setStudents] = useState<StudentResponse[]>();
    const [subgroups, setSubgroups] = useState<SubgroupResponse[]>();

    const [changedStudents, setChangedStudents] = useState<boolean>(false);
    const [changedSubgroups, setChangedSubgroups] = useState<boolean>(false);
    const [changedCourses, setChangedCourses] = useState<boolean>(false);

    const [selectedId, setSelectedId] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseGroup = await api.get<GroupResponse>(`core/v1/admin/groups/${groupId}`);
            setGroup(responseGroup.data);
        };
        fetch().then(() => setLoading(false));
    }, [groupId]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseCourses = await api.get<CourseResponse[]>(`core/v1/admin/courses?groupId=${groupId}`)
            setCourses(responseCourses.data);
        };
        fetch().then(() => setLoading(false));
    }, [groupId, changedCourses]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseSubgroups = await api.get<SubgroupResponse[]>(`core/v1/admin/groups/${groupId}/subgroups`)
            setSubgroups(responseSubgroups.data);
        };
        fetch().then(() => setLoading(false));
    }, [groupId, changedSubgroups]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseStudents = await api.get<StudentResponse[]>(`core/v1/admin/students?groupId=${groupId}`)
            setStudents(responseStudents.data);
        };
        fetch().then(() => setLoading(false));
    }, [groupId, changedStudents]);

    if (loading) {
        return <LoadingPage/>;
    }

    const handleCreateSubgroup = async () => {
        await api.post(`core/v1/admin/groups/${groupId}/subgroups`)
            .then(() => {
                setChangedSubgroups(!changedSubgroups);
            });
    }

    const handleDeleteSubgroup = async (subgroupId: string) => {
        await api.delete(`core/v1/admin/groups/${groupId}/subgroups/${subgroupId}`)
            .then(() => {
                setChangedSubgroups(!changedSubgroups);
            });
    }

    const handleCreateStudent = async (data: CreateStudentRequest) => {
        await api.post(`core/v1/admin/students`, {
            "fullName": data.fullName,
            "password": data.password,
            "email": data.email,
            "phone": data.phone,
            "subgroupId": data.subgroupId
        }).then(() => {
            setChangedStudents(!changedStudents);
        })
    }

    const handleDeleteStudent = async (id: string) => {
        await api.delete(`core/v1/admin/students/${id}`)
            .then(() => {
                setChangedStudents(!changedStudents);
            })
    }

    const handleCreateCourse = async (name: string, teacherId: string) => {
        await api.post(`core/v1/admin/courses`, {
            "name": name,
            "teacherId": teacherId,
            "groupId": groupId,
        }).then(() => {
            setChangedCourses(!changedCourses);
        })
    }

    const handleDeleteCourse = async (id: string) => {
        await api.delete(`core/v1/admin/courses/${id}`)
            .then(() => {
                setChangedCourses(!changedCourses);
            })
    }

    return (
        <div className="min-h-screen bg-background p-0">
            <CreateCourseModal open={createCourseModalOpen} setOpenModal={setCreateCourseModalOpen} onCreate={handleCreateCourse}/>
            <DeleteCourseModal open={deleteCourseModalOpen} setOpenModal={setDeleteCourseModalOpen} onRemove={handleDeleteCourse} idToRemove={selectedId}/>
            <CreateStudentModal open={createStudentModalOpen} setOpenModal={setCreateStudentModalOpen} onCreate={handleCreateStudent} subgroupId={selectedId}/>
            <DeleteStudentModal open={deleteStudentModalOpen} setOpenModal={setDeleteStudentModalOpen} onRemove={handleDeleteStudent} idToRemove={selectedId}/>
            <CreateSubgroupModal open={createSubgroupModalOpen} setOpenModal={setCreateSubgroupModalOpen} onCreate={handleCreateSubgroup}/>
            <DeleteSubgroupModal open={deleteSubgroupModalOpen} setOpenModal={setDeleteSubgroupModalOpen} onRemove={handleDeleteSubgroup} idToRemove={selectedId}/>
            <main className="container mx-auto px-1 py-8">
                {/*group*/}
                <div className="grid gap-12 md:grid-cols-1 mb-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Խումբ - {group?.name}
                            </CardTitle>
                            <br/>
                            <CardTitle>
                                Ենթախմբեր - {subgroups?.length}
                            </CardTitle>
                            <br/>
                            <CardTitle>
                                Ուսանողներ - {students?.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                {/*courses*/}
                <div className="grid gap-12 md:grid-cols-1 mb-10">
                    <Card className="bg-[#212960]">
                        <Disclosure as="div">
                            <DisclosureButton as="div" className="group cursor-pointer">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 p-4 hover:cursor-pointer">
                                    <CardTitle>
                                        Առարկաներ
                                    </CardTitle>
                                    <ExpandMore className="group-data-[open]:rotate-180"/>
                                </CardHeader>
                            </DisclosureButton>
                            <DisclosurePanel>
                                <CardContent className="pt-2">
                                    {
                                        courses?.map(course => (
                                            <div className="flex flex-row justify-start space-x-5 p-1 items-center">
                                                <Button variant={"remove"} onClick={() => {
                                                    setSelectedId(course.id);
                                                    setDeleteCourseModalOpen(true);
                                                }}><Clear/></Button>
                                                <div className="text-m font-medium">{course.name}</div>
                                            </div>
                                        ))
                                    }

                                    <div className="flex flex-row justify-end space-x-5 p-1 items-center">
                                        <Button onClick={() => setCreateCourseModalOpen(true)}>
                                            <p>Ավելացնել նոր առարկա</p>
                                            <Add/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </DisclosurePanel>
                        </Disclosure>
                    </Card>
                </div>
                {/*subgroups*/}
                <div className="grid gap-12 md:grid-cols-1 mb-8">

                    {
                        subgroups?.map(subgroup => (
                            <Card className="bg-[#212960]/80">
                                <CardHeader>
                                    <CardTitle>
                                        {subgroup?.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {
                                        (students != null && students?.filter(student => student.subgroup.id === subgroup.id).length > 0) &&
                                            <TableContainer className="mb-4">
                                                <Table sx={{minWidth: 650}}>
                                                    <TableHead className="bg-[#212960]">
                                                        <TableRow>
                                                            <TableCell>Համար</TableCell>
                                                            <TableCell>Անուն Ազգանուն</TableCell>
                                                            <TableCell align="right">Էլ. հասցե</TableCell>
                                                            <TableCell align="right">Հեռախոսահամար</TableCell>
                                                            <TableCell align="right"></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {students?.filter(student => student.subgroup.id === subgroup.id)
                                                            .map((student, index) => (
                                                                <TableRow
                                                                    className={(index % 2 === 0) ? "bg-[#212960]/30" : ""}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{student.fullName}</TableCell>
                                                                    <TableCell align="right">{student.email}</TableCell>
                                                                    <TableCell align="right">{student.phone}</TableCell>
                                                                    <TableCell align="right">
                                                                        <Button className="mr-2"><LockReset/></Button>
                                                                        <Button variant="remove" onClick={() => {
                                                                            setSelectedId(student.id);
                                                                            setDeleteStudentModalOpen(true);
                                                                        }}>
                                                                            <PersonRemove/></Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                    }
                                    <div className="flex flex-row items-end justify-end space-x-5">
                                        {
                                            (students == null || students?.filter(student => student.subgroup.id === subgroup.id).length === 0) &&
                                            <Button variant="remove" onClick={() => {
                                                setSelectedId(subgroup.id);
                                                setDeleteSubgroupModalOpen(true);
                                            }}>
                                                <p>Հեռացնել ենթախումբը</p>
                                                <GroupRemove/>
                                            </Button>
                                        }
                                        <Button onClick={() => {
                                            setSelectedId(subgroup.id);
                                            setCreateStudentModalOpen(true)
                                        }}>
                                            <p>Ավելացնել ուսանող</p>
                                            <PersonAddAlt1/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
                <div className="flex flex-row items-end justify-end space-x-5">
                    <Button onClick={() => {
                        setCreateSubgroupModalOpen(true)
                    }}>
                        <p>Ավելացնել ենթախումբ</p>
                        <GroupAdd/>
                    </Button>
                </div>
            </main>
        </div>
    )
}