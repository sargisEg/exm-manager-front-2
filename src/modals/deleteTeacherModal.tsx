import {Description, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from "@headlessui/react";
import {Button} from "../components/button";
import {Fragment} from "react";

export const DeleteTeacherModal = ({ open, setOpenModal, onRemove, idToRemove }: { open: boolean; setOpenModal: (val: boolean) => void; onRemove: (subgroupId : string) => void; idToRemove: string}) => {

    const handleSubmit = () => {
        onRemove(idToRemove);
        setOpenModal(false);
    }

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setOpenModal(false)}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                                Delete Teacher
                            </DialogTitle>

                            <Description className="mt-2 text-sm text-gray-900">
                                Are you sure that you want to delete a teacher?
                            </Description>

                            <div className="mt-6 flex justify-end gap-4">
                                <Button variant="cancel" onClick={() => setOpenModal(false)}>Cancel</Button>
                                <Button variant="remove" onClick={handleSubmit}>Delete</Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
