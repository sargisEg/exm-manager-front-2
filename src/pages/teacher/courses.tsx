import {Card, CardHeader, CardTitle} from "../../components/card";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {CourseResponse} from "../../shared/models";
import {api} from "../../shared/api";
import LoadingPage from "../loading";

export default function TeacherCourses() {
    const history = useNavigate();
    const [loading, setLoading] = useState(false);

    const [courses, setCourses] = useState<CourseResponse[]>();
    // const [exams, setExams] = useState<ExamResponse[]>([]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseCourses = await api.get<CourseResponse[]>(`core/v1/courses`)
            setCourses(responseCourses.data);
            // const responseExams = await api.get<ExamResponse[]>(`core/v1/exams`);
            // setExams(responseExams.data);
        };
        fetch().then(() => setLoading(false));
    }, []);

    if (loading || !courses) {
        return <LoadingPage/>;
    }

    const coursesData: Record<string, CourseResponse[]> = {};

    courses.forEach((course: CourseResponse) => {
        if (!coursesData[course.name]) {
            coursesData[course.name] = [];
        }
        coursesData[course.name].push(course);
    })
    //
    // const ungradedCourses = exams
    //     .filter(exam => exam.status === ExamStatus.FINISHED)
    //     .map((exam: ExamResponse) => {
    //         return exam.course;
    //     })

    return (
        <div className="min-h-screen bg-background p-0">
            <main className="container mx-auto px-1 py-8">
                {/*{*/}
                {/*    ungradedCourses && ungradedCourses.length > 0 && (*/}
                {/*        <>*/}
                {/*            <div className="text-black text-2xl">Չգնահատված քննություններ</div>*/}
                {/*            <br/>*/}
                {/*            <div className="grid gap-12 md:grid-cols-4 mb-8">*/}
                {/*                <Card className="hover:bg-[#1B84FF] hover:cursor-pointer border-[#ffb300] border-4" onClick={() => {*/}
                {/*                    history("chgnahatvac/courseId");*/}
                {/*                }}>*/}
                {/*                    <CardHeader>*/}
                {/*                        <CardTitle>*/}
                {/*                            Օբյեկտ Կողմնորոշված ծրագրավորում*/}
                {/*                        </CardTitle>*/}
                {/*                        <br/>*/}
                {/*                        <CardTitle>*/}
                {/*                            319 խումբ*/}
                {/*                        </CardTitle>*/}
                {/*                    </CardHeader>*/}
                {/*                </Card>*/}
                {/*            </div>*/}
                {/*            <hr className="mb-8"/>*/}
                {/*        </>*/}
                {/*    )*/}
                {/*}*/}
                {
                    Object.keys(coursesData).map((courseName: string) => (
                        <>
                            <div className="grid gap-12 md:grid-cols-4 mb-8">
                                {
                                    coursesData[courseName].map((course: CourseResponse) => (
                                        <Card className="hover:bg-[#1B84FF] hover:cursor-pointer" onClick={() => history(course.id)}>
                                            <CardHeader>
                                                <CardTitle>
                                                    {courseName}
                                                </CardTitle>
                                                <br/>
                                                <CardTitle>
                                                    Խումբ - {course.group.name}
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    ))
                                }
                            </div>
                            <hr className="mb-8 border-2"/>
                        </>
                    ))
                }
            </main>
        </div>
    )
}