import {Card, CardContent, CardHeader, CardTitle} from "../../components/card";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CourseResponse, GroupResponse, StudentResponse, SubgroupResponse} from "../../shared/models";
import {api} from "../../shared/api";
import LoadingPage from "../loading";

export default function TeacherGroupDetails() {
    const {groupId} = useParams();
    const [loading, setLoading] = useState(false);

    const [group, setGroup] = useState<GroupResponse>();
    const [courses, setCourses] = useState<CourseResponse[]>();
    const [students, setStudents] = useState<StudentResponse[]>();
    const [subgroups, setSubgroups] = useState<SubgroupResponse[]>();

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseGroup = await api.get<GroupResponse>(`core/v1/groups/${groupId}`);
            const responseSubgroups = await api.get<SubgroupResponse[]>(`core/v1/groups/${groupId}/subgroups`)
            const responseCourses = await api.get<CourseResponse[]>(`core/v1/courses?groupId=${groupId}`)
            const responseStudents = await api.get<StudentResponse[]>(`core/v1/students?groupId=${groupId}`)
            setStudents(responseStudents.data);
            setSubgroups(responseSubgroups.data);
            setCourses(responseCourses.data);
            setGroup(responseGroup.data);
        };
        fetch().then(() => setLoading(false));
    }, [groupId]);

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className="min-h-screen bg-background p-0">
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
                                {(courses != null && courses?.length) > 1 ? "Առարկաներ" : "Առարկա"} - {courses?.map((c, index) => {
                                return ((index === 0) ? `${c.name}` : `, ${c.name}`);
                            })}
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
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    }
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </main>
        </div>
    )
}