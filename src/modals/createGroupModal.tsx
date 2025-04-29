import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react'
import {Fragment, useState} from 'react'
import {Input} from "../components/imput";
import {Button} from "../components/button";
import {CreateGroupRequest} from "../shared/models";

interface CreateGroupModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (data: CreateGroupRequest) => void;
}

export default function CreateGroupModal({open, onClose, onCreate}: CreateGroupModalProps) {
    const [name, setName] = useState('');
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [endYear, setEndYear] = useState(new Date().getFullYear() + 4);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Name is required.');
            return;
        }
        if (!startYear) {
            setError('Start Year is required.');
            return;
        }
        if (!endYear) {
            setError('End Year is required.');
            return;
        }
        if (startYear > endYear) {
            setError('Start Year cannot be after End Year.');
            return;
        }

        setError(null);
        onCreate({name, startYear, endYear});
        setName('');
        setStartYear(new Date().getFullYear());
        setEndYear(new Date().getFullYear());
        onClose();
    }

    const handleClose = () => {
        onClose();
        setError(null);
        setName('');
        setStartYear(new Date().getFullYear());
        setEndYear(new Date().getFullYear());
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
                                Create New Group
                            </DialogTitle>
                            <div className="flex flex-col gap-4">
                                <Input
                                    required
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Input
                                    required
                                    type="number"
                                    placeholder="Start Year"
                                    value={startYear}
                                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Input
                                    required
                                    type="number"
                                    placeholder="End Year"
                                    value={endYear}
                                    onChange={(e) => setEndYear(parseInt(e.target.value))}
                                    className="bg-[#f9f9f9] text-black"
                                />
                            </div>


                            {error &&
                                <div className="mt-4 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                                    {error}
                                </div>
                            }
                            <div className="mt-6 flex justify-end gap-4">
                                <Button
                                    onClick={handleClose}
                                    variant="cancel"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Create
                                </Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
