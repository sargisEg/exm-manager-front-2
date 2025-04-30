import {Description, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from "@headlessui/react";
import {Button} from "../components/button";
import {Fragment} from "react";

export const CreateSubgroupModal = ({ open, setOpenModal, onCreate }: { open: boolean; setOpenModal: (val: boolean) => void; onCreate: () => void }) => {

    const handleSubmit = () => {
        onCreate();
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
                                Ստեղծել Նոր Ենթախումբ
                            </DialogTitle>

                            <Description className="mt-2 text-sm text-gray-900">
                                Ուզու՞մ եք ստեղծել նոր ենթախումբ։
                            </Description>

                            <div className="mt-6 flex justify-end gap-4">
                                <Button variant="cancel" onClick={() => setOpenModal(false)}>Չեղարկել</Button>
                                <Button onClick={handleSubmit}>Ստեղծել</Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
