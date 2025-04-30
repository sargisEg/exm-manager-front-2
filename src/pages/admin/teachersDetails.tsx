import {More} from '@mui/icons-material'
import {Button} from "../../components/button";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CourseResponse, GroupResponse, TeacherResponse, UserResponse} from "../../shared/models";
import {api} from "../../shared/api";
import LoadingPage from "../loading";
import {Card, CardHeader, CardTitle} from "../../components/card";

export default function AdminTeacherDetails() {
    const history = useNavigate();
    const {teacherId} = useParams();

    const [teacher, setTeacher] = useState<UserResponse>();
    const [courses, setCourses] = useState<CourseResponse[]>();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseTeacher = await api.get<TeacherResponse>(`core/v1/admin/teachers/${teacherId}`)
            setTeacher(responseTeacher.data.user);
            setCourses(responseTeacher.data.courses);
        };
        fetch().then(() => setLoading(false));
    }, [teacherId]);

    if (loading) {
        return <LoadingPage/>;
    }

    const groupData: Record<string, GroupResponse> = {};
    const coursesData: Record<string, CourseResponse[]> = {};
    courses?.forEach((course: CourseResponse) => {
        const now = new Date();
        if(course.semester === (course.group.academicYear * 2 - ((now.getMonth() < 9 && now.getMonth() > 1) ? 0 : 1))) {
            if (!groupData[course.group.id]) {
                groupData[course.group.id] = course.group;
            }

            if (!coursesData[course.group.id]) {
                coursesData[course.group.id] = [];
            }
            coursesData[course.group.id].push(course);
        }
    })

    return (
        <div className="min-h-screen bg-background p-0">
            <main className="container mx-auto px-1 py-8">
                <div className="grid gap-12 md:grid-cols-1 mb-20">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {teacher?.fullName}
                            </CardTitle>
                            <br/>
                            <CardTitle>
                                էլ. հասցե - {teacher?.email}
                            </CardTitle>
                            <br/>
                            <CardTitle>
                                Հեռախոսահամար - {teacher?.phone}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <div className="grid gap-12 md:grid-cols-1 mb-3">
                    {
                        Object.keys(coursesData).map((key: string) => {
                            return (
                                <>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                            <CardTitle>
                                                Խումբ - {groupData[key].name}
                                            </CardTitle>
                                            <Button className="bg-[#1B84FF]/40" onClick={() => history(`/admin/groups/${key}`)}>
                                                <p>Մանրամասն</p>
                                                <More className="rotate-180"/>
                                            </Button>
                                        </CardHeader>
                                    </Card>
                                    <div className="grid gap-12 md:grid-cols-4 mb-8">
                                        {
                                            coursesData[key]
                                                .filter((course: CourseResponse) => {
                                                    const now = new Date();
                                                    return course.semester === (groupData[key].academicYear * 2 - ((now.getMonth() < 9 && now.getMonth() > 1) ? 0 : 1));
                                                })
                                                .map((course: CourseResponse) => (
                                                <Card className="bg-[#212960]/80">
                                                    <CardHeader>
                                                        <CardTitle>
                                                            {course.name}
                                                        </CardTitle>
                                                    </CardHeader>
                                                </Card>
                                            ))
                                        }
                                    </div>
                                </>
                            );
                        })
                    }
                </div>
            </main>
        </div>
    )
}