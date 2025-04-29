import {Card, CardContent, CardHeader, CardTitle} from "../../components/card";
import {Apartment, Person, Group, School, Clear, Download, Upload} from '@mui/icons-material'
import {ExpandMore} from "@mui/icons-material";
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react'
import {Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper} from '@mui/material'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CourseResponse, ExamResultResponse, GroupResponse, MaterialResponse} from "../../shared/models";
import {api} from "../../shared/api";
import LoadingPage from "../loading";
import moment from "moment";
import {number} from "react-admin";
import {Button} from "../../components/button";

export default function StudentCourses() {
    const {yearNumber} = useParams();
    const [loading, setLoading] = useState(false);

    const [group, setGroup] = useState<GroupResponse>();
    const [examResults, setExamResults] = useState<ExamResultResponse[]>();
    const [materials, setMaterials] = useState<MaterialResponse[]>();

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseGroup = await api.get<GroupResponse>(`core/v1/groups/me`)
            const responseExamResults = await api.get<ExamResultResponse[]>(`core/v1/exam-results/me`)
            const responseMaterials = await api.get<MaterialResponse[]>(`core/v1/materials/me`);
            setMaterials(responseMaterials.data);
            setGroup(responseGroup.data);
            setExamResults(responseExamResults.data)
        };
        fetch().then(() => setLoading(false));
    }, []);

    if (loading || !group || !examResults || !yearNumber) {
        return <LoadingPage/>;
    }

    const courses1: CourseResponse[] = Array.from(new Map(
        examResults.map(er => [er.exam.course.id, er.exam.course])
    ).values())
        .filter((course: CourseResponse) => (course.semester === parseInt(yearNumber)));

    const courses2: CourseResponse[] = Array.from(new Map(
        examResults.map(er => [er.exam.course.id, er.exam.course])
    ).values())
        .filter((course: CourseResponse) => (course.semester === parseInt(yearNumber) + 1));

    const courseResults: Record<string, number> = {};

    examResults.forEach(examResult => {
        if (!courseResults[examResult.exam.course.id]) {
            courseResults[examResult.exam.course.id] = 0;
        }
        courseResults[examResult.exam.course.id] += examResult.points;
    })
    const handleDownload = async (material: MaterialResponse) => {
        await api.get(`core/v1/courses/${material.courseId}/materials/${material.id}`, {
            responseType: 'blob',
        }).then((response) => {

            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', material.name);
            document.body.appendChild(link);
            link.click();

            link.remove();
            URL.revokeObjectURL(url);
        })
    }

    return (
        <div className="min-h-screen bg-background p-0">
            <main className="container mx-auto px-1 py-8">
                <div className="grid gap-12 md:grid-cols-1 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                I-ին կիսամյակ
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    {
                        courses1.map((course: CourseResponse) => (
                            <Card className="bg-[#212960]/80">
                                <Disclosure as="div">
                                    <DisclosureButton as="div" className="group cursor-pointer">
                                        <CardHeader
                                            className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-m font-medium">
                                                {course.name}
                                            </CardTitle>
                                            <ExpandMore className="scale-150 group-data-[open]:rotate-180"/>
                                        </CardHeader>
                                    </DisclosureButton>
                                    <CardContent className="pt-2">
                                        <DisclosurePanel>
                                            <div className="text-m font-medium mb-5">Ընդհանուր գնահատական
                                                - {courseResults[course.id]}</div>
                                            <div className="text-m font-medium mb-5">Քննություններ</div>
                                            <TableContainer className="rounded-lg border border-[#f9f9f9]">
                                                <Table sx={{minWidth: 650}}>
                                                    <TableHead className="bg-[#212960]">
                                                        <TableRow>
                                                            <TableCell>Անվանում</TableCell>
                                                            <TableCell align="right">Տեսակ</TableCell>
                                                            <TableCell align="right">Ամսաթիվ</TableCell>
                                                            <TableCell align="right">Գնահատական</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {examResults
                                                            .filter((examResult) => examResult.exam.course.id === course.id)
                                                            .map((examResult, index) => (
                                                                <TableRow
                                                                    className={(index % 2 === 0) ? "bg-[#212960]/30" : ""}>
                                                                    <TableCell>{examResult.exam.title}</TableCell>
                                                                    <TableCell
                                                                        align="right">{examResult.exam.type}</TableCell>
                                                                    <TableCell
                                                                        align="right">{moment(examResult.exam.startDate).format("DD.MM.YYYY")}</TableCell>
                                                                    <TableCell
                                                                        align="right">{examResult.points}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Card className="mt-2">
                                                <CardHeader
                                                    className="flex flex-row items-center justify-between space-y-0 p-4 hover:cursor-pointer">
                                                    <CardTitle>
                                                        Նյութեր
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-2">
                                                    {
                                                        materials &&
                                                        materials
                                                            .filter((material) => material.courseId === course.id)
                                                            .map((material) => (
                                                            <div
                                                                className="flex flex-row justify-start space-x-2 p-1 items-center">
                                                                <Button onClick={() => handleDownload(material)}><Download/></Button>
                                                                <div className="text-m font-medium">{material.name}</div>
                                                            </div>
                                                        ))
                                                    }
                                                </CardContent>
                                            </Card>
                                        </DisclosurePanel>
                                    </CardContent>
                                </Disclosure>
                            </Card>
                        ))
                    }
                    <Card></Card>
                    <Card className="mt-30">
                        <CardHeader>
                            <CardTitle>
                                II-րդ կիսամյակ
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    {
                        courses2.map((course: CourseResponse) => (
                            <Card className="bg-[#212960]/80">
                                <Disclosure as="div">
                                    <DisclosureButton as="div" className="group cursor-pointer">
                                        <CardHeader
                                            className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-m font-medium">
                                                {course.name}
                                            </CardTitle>
                                            <ExpandMore className="scale-150 group-data-[open]:rotate-180"/>
                                        </CardHeader>
                                    </DisclosureButton>
                                    <CardContent className="pt-2">
                                        <DisclosurePanel>
                                            <div className="text-m font-medium mb-5">Ընդհանուր գնահատական
                                                - {courseResults[course.id]}</div>
                                            <div className="text-m font-medium mb-5">Քննություններ</div>
                                            <TableContainer className="rounded-lg border border-[#f9f9f9]">
                                                <Table sx={{minWidth: 650}}>
                                                    <TableHead className="bg-[#212960]">
                                                        <TableRow>
                                                            <TableCell>Անվանում</TableCell>
                                                            <TableCell align="right">Տեսակ</TableCell>
                                                            <TableCell align="right">Ամսաթիվ</TableCell>
                                                            <TableCell align="right">Գնահատական</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {examResults
                                                            .filter((examResult) => examResult.exam.course.id === course.id)
                                                            .map((examResult, index) => (
                                                                <TableRow
                                                                    className={(index % 2 === 0) ? "bg-[#212960]/30" : ""}>
                                                                    <TableCell>{examResult.exam.title}</TableCell>
                                                                    <TableCell
                                                                        align="right">{examResult.exam.type}</TableCell>
                                                                    <TableCell
                                                                        align="right">{moment(examResult.exam.startDate).format("DD.MM.YYYY")}</TableCell>
                                                                    <TableCell
                                                                        align="right">{examResult.points}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Card className="mt-2">
                                                <CardHeader
                                                    className="flex flex-row items-center justify-between space-y-0 p-4 hover:cursor-pointer">
                                                    <CardTitle>
                                                        Նյութեր
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-2">
                                                    {
                                                        materials &&
                                                        materials
                                                            .filter((material) => material.courseId === course.id)
                                                            .map((material) => (
                                                            <div
                                                                className="flex flex-row justify-start space-x-2 p-1 items-center">
                                                                <Button onClick={() => handleDownload(material)}><Download/></Button>
                                                                <div className="text-m font-medium">{material.name}</div>
                                                            </div>
                                                        ))
                                                    }
                                                </CardContent>
                                            </Card>
                                        </DisclosurePanel>
                                    </CardContent>
                                </Disclosure>
                            </Card>
                        ))
                    }
                </div>
            </main>
        </div>
    )
}