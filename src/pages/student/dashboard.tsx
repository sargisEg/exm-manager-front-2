import {Card, CardContent, CardHeader, CardTitle} from "../../components/card";
import {Apartment, Person, Group, School} from '@mui/icons-material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useEffect, useState} from "react";
import {CourseResponse, ExamResultResponse, GroupResponse} from "../../shared/models";
import {api} from "../../shared/api";
import LoadingPage from "../loading";
import {number} from "react-admin";

export default function StudentDashboard() {
    const [loading, setLoading] = useState(false);

    const [group, setGroup] = useState<GroupResponse>();
    const [examResults, setExamResults] = useState<ExamResultResponse[]>();

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseGroup = await api.get<GroupResponse>(`core/v1/groups/me`)
            const responseExamResults = await api.get<ExamResultResponse[]>(`core/v1/exam-results/me`)
            setGroup(responseGroup.data);
            setExamResults(responseExamResults.data)
        };
        fetch().then(() => setLoading(false));
    }, []);

    if (loading || !group || !examResults) {
        return <LoadingPage/>;
    }

    const courseResults: Record<string, number> = {};

    examResults.forEach(examResult => {
        if (!courseResults[examResult.exam.course.id]) {
            courseResults[examResult.exam.course.id] = 0;
        }
        courseResults[examResult.exam.course.id] += examResult.points;
    })

    const courses: CourseResponse[] =  Array.from(new Map(
            examResults.map(er => [er.exam.course.id, er.exam.course])
        ).values()
    );

    // const coursesResults: {
    //     courses: CourseResponse;
    //     result: number;
    // }

    return (
        <div className="min-h-screen bg-background p-0">
            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-12 md:grid-cols-2 mb-8">
                    {
                        [...Array(group.academicYear * 2)].map((_, i) => (
                            <Card className="bg-[#212960]/80">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-2xl font-bold">
                                        {i < 8 ? "Բակալավր - " + (Math.floor(i / 2) + 1) : "Մագիստրատուրա - " + (Math.floor(i / 2) - 3)}
                                    </CardTitle>
                                </CardHeader>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-2xl font-bold">
                                        Կիսամյակ - {i + 1}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="mt-8">
                                    {/*<div className="text-m font-medium mb-5">Միջին գնահատական - 85</div>*/}
                                    <TableContainer>
                                        <Table sx={{minWidth: 650}}>
                                            <TableHead className="bg-[#212960]">
                                                <TableRow>
                                                    <TableCell>Առարկա</TableCell>
                                                    <TableCell align="right">Գնահատական</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {courses
                                                    .filter((c) => c.semester === i+1)
                                                    .map((course, index) => (
                                                    <TableRow className={(index % 2 === 0) ? "bg-[#212960]/30" : ""}>
                                                        <TableCell>{course.name}</TableCell>
                                                        <TableCell align="right">{courseResults[course.id]}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </main>
        </div>
    )
}