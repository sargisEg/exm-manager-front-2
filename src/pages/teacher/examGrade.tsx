import {Card, CardHeader, CardTitle} from "../../components/card";
import {PlaylistAddCheck} from '@mui/icons-material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "../../components/button";
import {useEffect, useState} from "react";
import {ExamResponse, StudentResponse} from "../../shared/models";
import {api} from "../../shared/api";
import LoadingPage from "../loading";

export default function TeacherExamGrade() {
    const {courseId} = useParams();
    const {examId} = useParams();
    const [loading, setLoading] = useState(false);
    const history = useNavigate();

    const [students, setStudents] = useState<StudentResponse[]>();
    const [exam, setExam] = useState<ExamResponse>();
    const [error, setError] = useState<boolean | null>(null);
    const [grades] = useState<Record<string, number>>({});

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseExam = await api.get<ExamResponse>(`core/v1/exams/${examId}`);
            setExam(responseExam.data);
            const responseStudents = await api.get<StudentResponse[]>(`core/v1/students?groupId=${responseExam.data.subgroup.group.id}/students`)
            setStudents(responseStudents.data);
        };
        fetch().then(() => setLoading(false));
    }, [examId]);

    if (loading || !exam || !students) {
        return <LoadingPage/>;
    }

    const handleGrade = () => {
        if (Object.keys(grades).length !== students.filter((student) => student.subgroup.id === exam.subgroup.id).length) {
            setError(true);
            return;
        }

        api.put(`core/v1/exams/${exam.id}/grade`, {
            grades
        }).then(() => {
            history(`/teacher/exams/${courseId}`);
        })
    };

    return (
        <div className="min-h-screen bg-background p-0">
            <main className="container mx-auto px-1 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {exam.title}
                        </CardTitle>
                        <br/>
                        <CardTitle>
                            Խումբ - {exam.subgroup.group.name}
                        </CardTitle>
                        <br/>
                        <CardTitle>
                             Ենթախումբ - {exam.subgroup.name}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <br/>
                <div className="text-black text-2xl mb-8">Գնահատել քննությունը</div>
                <TableContainer className="bg-[#212960]/80 mb-8">
                    <Table sx={{minWidth: 650}}>
                        <TableHead className="bg-[#212960]">
                            <TableRow>
                                <TableCell>Համար</TableCell>
                                <TableCell>Անուն Ազգանուն</TableCell>
                                <TableCell align="right">Միավոր</TableCell>
                                <TableCell align="right">Առավելագույն Միավոր</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students
                                .filter((student) => student.subgroup.id === exam.subgroup.id)
                                .map((student, index) => (
                                <TableRow className={(index % 2 === 0) ? "bg-[#212960]/30" : ""}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{student.fullName}</TableCell>
                                    <TableCell align="right">
                                        <input
                                            type="number"
                                            className="w-16 bg-[#2a3373] text-[#f9f9f9] placeholder-[#cbd5e1] border border-[#3b427a] rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-[#1B84FF]/60
                                            [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                let value = parseInt(input.value, 10);

                                                if (isNaN(value)) {
                                                    input.value = "";
                                                    return;
                                                }
                                                if (value < 0) value = 0;
                                                if (value > 20) value = 20;

                                                input.value = value.toString();
                                            }}
                                            onChange={(e) => {
                                                setError(null)
                                                return grades[student.id] = parseInt(e.target.value);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">20</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {error &&
                    <div
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm mb-4">
                        Լրացրեք բոլոր դաշտերը
                    </div>
                }
                <div className="flex flex-row items-end justify-end space-x-5">
                    <Button onClick={() => handleGrade()}>
                        <p>Գնահատել</p>
                        <PlaylistAddCheck/>
                    </Button>
                </div>
            </main>
        </div>
    )
}