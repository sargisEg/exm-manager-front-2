import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
    TransitionChild
} from '@headlessui/react'
import {Fragment, useEffect, useState} from 'react'
import {Input} from "../components/imput";
import {Button} from "../components/button";
import {UserResponse} from "../shared/models";
import {api} from "../shared/api";

interface CreateStudentModalProps {
    open: boolean;
    setOpenModal: (val: boolean) => void;
    onCreate: (name: string, teacherId: string) => void;
}

export default function CreateCourseModal({open, setOpenModal, onCreate}: CreateStudentModalProps) {
    const [name, setName] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState<UserResponse | null>();
    const [teachers, setTeachers] = useState<UserResponse[]>();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            return await api.get<UserResponse[]>(`core/v1/admin/teachers`);
        };
        fetch().then((res) => {
            setTeachers(res.data);
        });
    }, []);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Լրացրեք ենթախմբի անունը։');
            return;
        }
        if (!selectedTeacher) {
            setError('Ընտրեք դասախոս։');
            return;
        }

        setError(null);
        onCreate(name, selectedTeacher.id);
        setName('');
        setSelectedTeacher(null);
        setOpenModal(false);
    }

    const handleClose = () => {
        setOpenModal(false);
        setName('');
        setSelectedTeacher(null);
        setError(null);
    }

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
                                Ստեղծել Նոր Դասընթաց
                            </DialogTitle>
                            <div className="flex flex-col gap-4">
                                <Input
                                    required
                                    type="text"
                                    placeholder="Անվանում"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Listbox value={selectedTeacher} onChange={setSelectedTeacher}>
                                    <div className="relative">
                                        <ListboxButton
                                            className="w-full bg-[#f9f9f9] text-black border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-[#1B84FF] focus:border-[#1B84FF]">
                                            {selectedTeacher
                                                ? selectedTeacher.fullName
                                                : <span className="text-gray-500">Ընտրեք դասախոս…</span>}
                                        </ListboxButton>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0">
                                            <ListboxOptions
                                                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto py-1 text-base">
                                                {teachers?.map((teacher) => (
                                                    <ListboxOption
                                                        key={teacher.id}
                                                        value={teacher}
                                                        className={({focus, selected}) =>
                                                            `cursor-pointer select-none px-3 py-2 ${focus ? 'bg-[#1B84FF]/20 text-[#1B84FF]' : 'text-gray-900'} ${selected ? 'font-semibold' : 'font-normal'}`
                                                        }>
                                                        {teacher.fullName}
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>


                            {error &&
                                <div
                                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                                    {error}
                                </div>
                            }
                            <div className="mt-6 flex justify-end gap-4">
                                <Button onClick={handleClose} variant="cancel">
                                    Չեղարկել
                                </Button>
                                <Button type="submit" onClick={handleSubmit}>
                                    Ստեղծել
                                </Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
