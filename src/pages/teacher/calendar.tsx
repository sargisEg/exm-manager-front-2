import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import {Card, CardContent, CardHeader, CardTitle} from "../../components/card";
import Moment from 'moment';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {api} from "../../shared/api";
import {ExamResponse, ExamType, examTypeLabels} from "../../shared/models";
import LoadingPage from "../loading";

export default function TeacherCalendar() {
    const [loading, setLoading] = useState(false);

    const [exams, setExams] = useState<ExamResponse[]>([]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const responseExams = await api.get<ExamResponse[]>(`core/v1/exams`);
            setExams(responseExams.data);
        };
        fetch().then(() => setLoading(false));
    }, []);

    if (loading) {
        return <LoadingPage/>;
    }

    const calendarEvents = exams.map((exam) => ({
        title: exam.title,
        start: new Date(exam.startDate),
        end: new Date(exam.endDate),
        extendedProps: {
            location: exam.location,
            type: examTypeLabels[exam.type],
            course: exam.course.name,
        },
    }));


    return (
        <div className="min-h-screen bg-background p-0">
            <main className="container mx-auto px-1 py-8">
                <div className="grid gap-12 md:grid-cols-1 mb-8">
                    <FullCalendar
                        headerToolbar={
                            {
                                right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                left: 'prev,next today',
                                center: 'title',
                            }
                        }
                        titleFormat={{year: 'numeric', month: 'long'}}
                        viewClassNames="bg-[#1B84FF]/40 text-black "
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        aspectRatio={3}
                        events={calendarEvents}
                        dayHeaderClassNames="bg-[#212960] text-[#f9f9f9]"
                        dayCellDidMount={({date, el}) => {
                            const today = new Date();
                            if (
                                date.getDate() === today.getDate() &&
                                date.getMonth() === today.getMonth() &&
                                date.getFullYear() === today.getFullYear()
                            ) {
                                console.log(el)
                                el.style.setProperty('background', '#1B84FF05');
                                el.style.setProperty('border', '3px solid #212960');
                            }
                        }}
                        slotMinTime="06:00"
                        slotMaxTime="19:00"
                        allDaySlot={false}
                        slotLabelClassNames={"bg-[#212960] text-[#f9f9f9]"}
                        slotDuration="00:30:00"
                        slotLabelInterval="00:30:00"
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }}
                        eventContent={(arg) => {
                            const timeString = arg.event.start
                                ? new Intl.DateTimeFormat('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(arg.event.start)
                                : '';
                            const timeEnding = arg.event.end
                                ? new Intl.DateTimeFormat('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }).format(arg.event.end)
                                : '';

                            if (arg.view.type === 'timeGridWeek' || arg.view.type === 'timeGridDay') {
                                return (
                                    <div className="p-2 bg-[#cce9ff]/90 border border-gray-300 rounded shadow text-xs">
                                        <div className="font-semibold text-gray-800">{arg.event.title}</div>
                                    </div>
                                );
                            }

                            return (
                                <>
                                    <div className="p-1 rounded-md bg-[#cce9ff] shadow-sm border border-gray-200">
                                        <div className="text-xs font-semibold text-gray-800 truncate">
                                            {arg.event.title}
                                        </div>
                                        <div className="text-[10px] text-gray-500 truncate">
                                            📍 {arg.event.extendedProps.location}
                                        </div>
                                        <div className="text-[10px] text-gray-500 truncate">
                                            {timeString} - {timeEnding}
                                        </div>
                                        <div
                                            className={`mt-0.5 text-[10px] inline-block px-1.5 py-0.5 rounded-full ${
                                                arg.event.extendedProps.type === ExamType.GENERAL
                                                    ? 'bg-red-100 text-red-700'
                                                    : arg.event.extendedProps.type === ExamType.REPEAT
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {arg.event.extendedProps.type}
                                        </div>
                                    </div>
                                </>
                            );
                        }}
                        views={{
                            timeGridDay: {
                                dayHeaderFormat: {weekday: 'long', day: 'numeric'},
                            },
                            timeGridWeek: {
                                dayHeaderFormat: {weekday: 'short', day: 'numeric'},
                            }
                        }}
                    />
                    <div className="grid gap-12 md:grid-cols-4 mb-8">
                        {
                            exams.map((exam) => (
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-xl font-bold">
                                            {exam.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <br/>
                                    <CardContent>
                                        <div className="text-m font-medium">
                                            Սկիզբ - {Moment(exam.startDate).format('DD-MM-YY HH:mm')}
                                        </div>
                                        <div className="text-m font-medium">
                                            Ավարտ - {Moment(exam.endDate).format('DD-MM-YY HH:mm')}
                                        </div>
                                        <div className="text-m font-medium">
                                            Վայր - {exam.location}
                                        </div>
                                        <div className="text-m font-medium">
                                            Առարկա - {exam.course.name}
                                        </div>
                                        <div className="text-m font-medium">
                                            Առավելագույն միավորներ - {exam.maxPoints}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>

                </div>
            </main>
        </div>
    )
}