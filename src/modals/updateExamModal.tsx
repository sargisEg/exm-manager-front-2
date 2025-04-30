import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react'
import {forwardRef, Fragment, useEffect, useState} from 'react'
import {Input} from "../components/imput";
import {Button} from "../components/button";
import {ExamResponse, UpdateExamRequest} from "../shared/models";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Minimize} from "@mui/icons-material"
import {addDays, addHours, addMinutes, setHours, setMinutes} from 'date-fns';

interface UpdateExamModalProps {
    open: boolean;
    setOpenModal: (val: boolean) => void;
    onUpdate: (data: UpdateExamRequest) => void;
    exam: ExamResponse;
}

export default function UpdateExamModal({open, setOpenModal, onUpdate, exam}: UpdateExamModalProps) {
    const [title, setTitle] = useState(exam.title);
    const [location, setLocation] = useState(exam.location);
    const [date, setDate] = useState<Date | undefined>(new Date(exam.startDate));
    const [startTime, setStartTime] = useState<Date | undefined>(new Date(exam.startDate));
    const [endTime, setEndTime] = useState<Date | undefined>(new Date(exam.endDate));
    const [maxPoints, setMaxPoints] = useState<number | undefined>(exam.maxPoints);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTitle(exam.title);
        setLocation(exam.location);
        setDate(new Date(exam.startDate));
        setStartTime(new Date(exam.startDate));
        setEndTime(new Date(exam.endDate));
        setMaxPoints(exam.maxPoints);
    }, [exam]);

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('Լրացրեք անվանումը։');
            return;
        }
        if (!location.trim()) {
            setError('Լրացրեք վայրը։');
            return;
        }
        if (!date) {
            setError('Լրացրեք ամսաթիվը');
            return;
        }
        if (!startTime) {
            setError('Լրացրեք սկսելու ժամը');
            return;
        }
        if (!endTime) {
            setError('Լրացրեք ավարտելու ժամը');
            return;
        }
        if (!maxPoints) {
            setError('Լրացրեք առավելագույն միավորները');
            return;
        }

        const data: UpdateExamRequest = {
            title: title,
            location: location,
            startDate: addHours(addMinutes(date, startTime.getMinutes()), startTime.getHours()).getTime(),
            endDate: addHours(addMinutes(date, endTime.getMinutes()), endTime.getHours()).getTime(),
            maxPoints: maxPoints,
        };

        onUpdate(data);
        setError(null);
        setOpenModal(false);
    }

    const handleClose = () => {
        setOpenModal(false);
        setTitle(exam.title);
        setLocation(exam.location);
        setDate(new Date(exam.startDate));
        setStartTime(new Date(exam.startDate));
        setEndTime(new Date(exam.endDate));
        setMaxPoints(exam.maxPoints);
        setError(null);
    }


    const isWeekday = (date: Date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    const DateInput = forwardRef(({value, onClick}: any, ref: any) => (
        <Input
            onChange={() => {
            }}
            value={value}
            type="text"
            contentEditable="false"
            onClick={onClick}
            ref={ref}
            placeholder="Ամսաթիվ"
            className="text-center bg-[#f9f9f9] text-black"
        >
        </Input>
    ));

    const StartTimeInput = forwardRef(({value, onClick}: any, ref: any) => (
        <Input
            onChange={() => {
            }}
            value={value}
            type="text"
            contentEditable="false"
            onClick={onClick}
            ref={ref}
            placeholder="Սկիզբ"
            className="text-center w-full bg-[#f9f9f9] text-black"
        >
        </Input>
    ));

    const EndTimeInput = forwardRef(({value, onClick}: any, ref: any) => (
        <Input
            onChange={() => {
            }}
            disabled={!startTime}
            value={value}
            type="text"
            contentEditable="false"
            onClick={onClick}
            ref={ref}
            placeholder="Ավարտ"
            className="text-center w-full bg-[#f9f9f9] text-black"
        >
        </Input>
    ));


    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"/>
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <DialogTitle className="text-lg font-bold text-gray-900 mb-4">
                                Փոփոխել Քննությունը
                            </DialogTitle>

                            <div className="flex flex-col gap-4">
                                <Input
                                    type="text"
                                    placeholder="Անվանում"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Input
                                    type="text"
                                    placeholder="Վայր"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <DatePicker
                                    customInput={<DateInput/>}
                                    isClearable
                                    selected={date}
                                    onChange={(date) => setDate(date ? date : undefined)}
                                    placeholderText="Ամսաթիվ"
                                    dateFormat="MMMM d, yyyy"
                                    minDate={addDays(new Date(), 3)}
                                    filterDate={isWeekday}
                                />
                                <div className="flex flex-row gap-4 justify-center">
                                    <DatePicker
                                        customInput={<StartTimeInput/>}
                                        isClearable
                                        showTimeSelect
                                        selected={startTime}
                                        onChange={(date) => {
                                            setStartTime(date ? date : undefined);
                                            setEndTime(undefined);
                                        }}
                                        placeholderText="Սկիզբ"
                                        dateFormat="HH:mm"
                                        timeFormat="HH:mm"
                                        timeIntervals={5}
                                        timeCaption="Ժամ"
                                        showTimeSelectOnly
                                        minTime={setHours(setMinutes(new Date(), 0), 8)}
                                        maxTime={setHours(setMinutes(new Date(), 0), 18)}
                                    />
                                    <p className="text-black"><Minimize/></p>
                                    <DatePicker
                                        customInput={<EndTimeInput/>}
                                        isClearable
                                        disabled={!startTime}
                                        showTimeSelect
                                        selected={endTime}
                                        onChange={(date) => setEndTime(date ? date : undefined)}
                                        placeholderText="Ավարդ"
                                        dateFormat="HH:mm"
                                        timeFormat="HH:mm"
                                        timeIntervals={5}
                                        timeCaption="Ժամ"
                                        showTimeSelectOnly
                                        minTime={startTime ? startTime : setHours(setMinutes(new Date(), 0), 8)}
                                        maxTime={setHours(setMinutes(new Date(), 0), 18)}
                                    />
                                </div>
                                <Input
                                    type="number"
                                    placeholder="Առավելագույն միավորներ"
                                    value={maxPoints}
                                    onChange={(e) => setMaxPoints(parseInt(e.target.value))}
                                    className="bg-[#f9f9f9] text-black [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>

                            {error &&
                                <div
                                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                                    {error}
                                </div>
                            }

                            <div className="mt-6 flex justify-end gap-4">
                                <Button
                                    onClick={handleClose}
                                    variant="cancel"
                                >
                                    Չեղարկել
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                >
                                    Փոփոխել
                                </Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
