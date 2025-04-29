import {Card, CardContent, CardHeader, CardTitle} from "../../components/card";
import {
    ArrowForward,
    Download,
    EditNote,
    ExpandMore,
    Clear,
    PlaylistAdd,
    PlaylistRemove,
    Upload
} from '@mui/icons-material'
import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react'
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "../../components/button";
import CreateExamModal from "../../modals/createExamModal";
import {useEffect, useRef, useState} from "react";
import {
    CourseResponse,
    CreateExamRequest,
    ExamResponse,
    MaterialResponse,
    SubgroupResponse,
    UpdateExamRequest
} from "../../shared/models";
import LoadingPage from "../loading";
import {api} from "../../shared/api";
import {ErrorPage} from "../../util/404";
import {DeleteMaterialModal} from "../../modals/deleteMaterialModal";
import Moment from "moment";
import UpdateExamModal from "../../modals/updateExamModal";
import {DeleteExamModal} from "../../modals/deleteExamModal";

export default function TeacherExamDetails() {
    const {courseId} = useParams();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);

    const [changedMaterials, setChangedMaterials] = useState<boolean>(false);
    const [changedExams, setChangedExams] = useState<boolean>(false);

    const [openCreateExamModal, setOpenCreateExamModal] = useState(false);
    const [openUpdateExamModal, setOpenUpdateExamModal] = useState(false);
    const [openDeleteExamModal, setOpenDeleteExamModal] = useState(false);
    const [openDeleteMaterialModal, setOpenDeleteMaterialModal] = useState(false);

    const [selectedId, setSelectedId] = useState<string>('');
    const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);

    const [course, setCourse] = useState<CourseResponse>();
    const [subgroups, setSubgroups] = useState<SubgroupResponse[]>([]);
    const [materials, setMaterials] = useState<MaterialResponse[]>();
    const [upcomingExams, setUpcomingExams] = useState<ExamResponse[]>();
    const [notGradedExams, setNotGradedExams] = useState<ExamResponse[]>();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseCourses = await api.get<CourseResponse>(`core/v1/courses/${courseId}`);
            setCourse(responseCourses.data);

            const responseSubgroups = await api.get<SubgroupResponse[]>(`core/v1/groups/${responseCourses.data.group.id}/subgroups`)
            setSubgroups(responseSubgroups.data);
        };
        fetch().then(() => setLoading(false));
    }, [courseId]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseMaterials = await api.get<MaterialResponse[]>(`core/v1/courses/${courseId}/materials`);
            setMaterials(responseMaterials.data);
        };
        fetch().then(() => setLoading(false));
    }, [changedMaterials, courseId]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseExams = await api.get<ExamResponse[]>(`core/v1/courses/${courseId}/exams?graded=true`);
            const responseNotGradedExams = await api.get<ExamResponse[]>(`core/v1/courses/${courseId}/exams?graded=false`);
            setUpcomingExams(responseExams.data);
            setNotGradedExams(responseNotGradedExams.data);
        };
        fetch().then(() => setLoading(false));
    }, [changedExams, courseId]);

    if (loading) {
        return <LoadingPage/>;
    }
    if (!courseId) {
        return <ErrorPage/>;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            const formData = new FormData();
            formData.append("file", selected);
            api.post(`core/v1/courses/${courseId}/materials`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then(() => {
                setChangedMaterials(!changedMaterials);
            }).finally(() => {
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            })
        }
    };

    const handleChooseFile = () => {
        inputRef.current?.click();
    };

    const handleCreateExam = async (data: CreateExamRequest) => {
        await api.post<ExamResponse>(`core/v1/exams`, {
            "title": data.title,
            "courseId": data.courseId,
            "subgroupId": data.subgroupId,
            "location": data.location,
            "startDate": data.startDate,
            "endDate": data.endDate,
            "maxPoints": data.maxPoints,
            "type": data.type,
        }).then(() => {
            setChangedExams(!changedExams);
        })
    }

    const handleDownload = async (material: MaterialResponse) => {
        await api.get(`core/v1/courses/${courseId}/materials/${material.id}`, {
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

    const handleRemoveMaterial = (materialId: string) => {
        api.delete(`core/v1/courses/${courseId}/materials/${materialId}`)
            .then(() => setChangedMaterials(!changedMaterials));
    }

    const handelUpdateExam = async (data: UpdateExamRequest) => {
        await api.put<ExamResponse>(`core/v1/exams/${selectedExam?.id}`, {
            "title": data.title,
            "location": data.location,
            "startDate": data.startDate,
            "endDate": data.endDate,
            "maxPoints": data.maxPoints,
        }).then(() => {
            setChangedExams(!changedExams);
        })
    }

    const handleRemoveExam = (id: string) => {
        api.delete(`core/v1/exams/${id}`)
            .then(() => setChangedExams(!changedExams));
    }

    return (
        <div className="min-h-screen bg-background p-0">
            <CreateExamModal
                open={openCreateExamModal}
                setOpenModal={setOpenCreateExamModal}
                courseId={courseId}
                subgroups={subgroups}
                onCreate={handleCreateExam}
            />
            <DeleteMaterialModal open={openDeleteMaterialModal} setOpenModal={setOpenDeleteMaterialModal}
                                 onRemove={handleRemoveMaterial} idToRemove={selectedId}/>
            {selectedExam &&
                <UpdateExamModal open={openUpdateExamModal} setOpenModal={setOpenUpdateExamModal}
                             onUpdate={handelUpdateExam} exam={selectedExam}/>
            }
            <DeleteExamModal open={openDeleteExamModal} setOpenModal={setOpenDeleteExamModal} onRemove={handleRemoveExam} idToRemove={selectedId}/>
            <main className="container mx-auto px-1 py-8">
                <div className="grid gap-12 md:grid-cols-1 mb-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {course?.name}
                            </CardTitle>
                            <br/>
                            <CardTitle>
                                Խումբ - {course?.group.name}
                            </CardTitle>
                            <br/>
                            <CardTitle>
                                Գալիք քննություններ - {upcomingExams?.length}
                            </CardTitle>
                            {
                                notGradedExams && notGradedExams.length > 0 && (
                                    <>
                                        <br/>
                                        <CardTitle className="border-2 border-[#ffb300] p-3">
                                            Չգնահատված քննություններ - {notGradedExams.length}
                                        </CardTitle>
                                    </>
                                )
                            }
                        </CardHeader>
                    </Card>
                </div>
                <div className="grid gap-12 md:grid-cols-1 mb-8">
                    <Card className="bg-[#212960]">
                        <Disclosure defaultOpen as="div">
                            <DisclosureButton as="div" className="group cursor-pointer">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 p-4 hover:cursor-pointer">
                                    <CardTitle>
                                        Նյութեր
                                    </CardTitle>
                                    <ExpandMore className="group-data-[open]:rotate-180"/>
                                </CardHeader>
                            </DisclosureButton>
                            <DisclosurePanel>
                                <CardContent className="pt-2">
                                    {
                                        materials && (materials.length === 0 ?
                                            <div className="text-m font-medium">Նյութեր չեն գտնվել</div>
                                            :
                                            materials.map((material) => (
                                                <div className="flex flex-row justify-start space-x-2 p-1 items-center">
                                                    <Button variant="remove" onClick={() => {
                                                        setSelectedId(material.id);
                                                        setOpenDeleteMaterialModal(true);
                                                    }}><Clear/></Button>
                                                    <Button onClick={() => handleDownload(material)}><Download/></Button>
                                                    <div className="text-m font-medium">{material.name}</div>
                                                </div>
                                            )))
                                    }
                                    <div className="flex flex-row justify-end space-x-5 p-1 items-center">
                                        <input
                                            type="file"
                                            ref={inputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <Button onClick={handleChooseFile}>
                                            <p>Ավելացնել նոր նյութ</p>
                                            <Upload/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </DisclosurePanel>
                        </Disclosure>
                    </Card>
                    <div className="flex flex-row items-end justify-end space-x-5">
                        <Button onClick={() => {
                            setOpenCreateExamModal(true)
                        }}>
                            <p>Ավելացնել նոր քննություն</p>
                            <PlaylistAdd/>
                        </Button>
                    </div>
                    {
                        subgroups?.map((subgroup) => (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {subgroup.name}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                                {
                                    notGradedExams && notGradedExams.length > 0 && (
                                        notGradedExams
                                            .filter((exam) => exam.subgroup.id === subgroup.id)
                                            .map((exam) => (
                                                <Card className="bg-[#212960]/80">
                                                    <CardHeader
                                                        className="flex flex-row items-center justify-between space-y-0 p-4">
                                                        <CardTitle>
                                                            ❗️{exam.title}
                                                        </CardTitle>
                                                        <Button onClick={() => {
                                                            history(`grade/${exam.id}`);
                                                        }}>
                                                            <p>Գնահատել</p>
                                                            <ArrowForward/>
                                                        </Button>
                                                    </CardHeader>
                                                </Card>
                                            ))
                                    )
                                }
                                {
                                    upcomingExams && upcomingExams.length > 0 && (
                                        upcomingExams
                                            .filter((exam) => exam.subgroup.id === subgroup.id)
                                            .map((exam) => (
                                                <Card className="bg-[#212960]/80">
                                                    <Disclosure as="div">
                                                        <DisclosureButton as="div" className="group cursor-pointer">
                                                            <CardHeader
                                                                className="flex flex-row items-center justify-between space-y-0 p-4 hover:cursor-pointer">
                                                                <CardTitle>
                                                                    {exam.title}
                                                                </CardTitle>
                                                                <ExpandMore className="group-data-[open]:rotate-180"/>
                                                            </CardHeader>
                                                        </DisclosureButton>
                                                        <DisclosurePanel>
                                                            <CardContent className="pt-2">
                                                                <div className="text-m font-medium mb-5">Դասընթաց
                                                                    - {exam.course.name}
                                                                </div>
                                                                <div className="text-m font-medium mb-5">Վայր
                                                                    - {exam.location}</div>
                                                                <div className="text-m font-medium mb-5">Ամսաթիվ
                                                                    - {Moment(new Date(exam.startDate)).format('DD.MM.YYYY')}</div>
                                                                <div className="text-m font-medium mb-5">Սկիզբ
                                                                    - {Moment(new Date(exam.startDate)).format('HH:mm')}</div>
                                                                <div className="text-m font-medium mb-5">Ավարտ
                                                                    - {Moment(new Date(exam.endDate)).format('HH:mm')}</div>
                                                                <div className="text-m font-medium mb-5">Առավելագույն
                                                                    միավորներ - {exam.maxPoints}
                                                                </div>
                                                                <div
                                                                    className="flex flex-row items-end justify-end space-x-5 p-4">
                                                                    <Button onClick={() => {
                                                                        setSelectedExam(exam);
                                                                        setOpenUpdateExamModal(true);
                                                                    }}>
                                                                        <p>Փոփոխել</p>
                                                                        <EditNote/>
                                                                    </Button>
                                                                    <Button variant="remove" onClick={() => {
                                                                        setSelectedId(exam.id);
                                                                        setOpenDeleteExamModal(true);
                                                                    }}>
                                                                        <p>Ջնջել</p>
                                                                        <PlaylistRemove/>
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </DisclosurePanel>
                                                    </Disclosure>
                                                </Card>
                                            ))
                                    )
                                }
                            </>
                        ))
                    }
                </div>
            </main>
        </div>
    )
}