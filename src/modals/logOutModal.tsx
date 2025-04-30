import {Dialog, DialogPanel, DialogTitle, Description, Transition, TransitionChild} from "@headlessui/react";
import { CloseSharp as CloseIcon } from "@mui/icons-material";
import { Button } from "../components/button";
import { useLogout } from "react-admin";
import {Fragment} from "react";

export const LogOutDialog = ({ open, setOpenModal }: { open: boolean; setOpenModal: (val: boolean) => void }) => {
    const logout = useLogout();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("u_id");
        localStorage.removeItem("u_r");
        localStorage.removeItem("u_e");
        logout();
    };

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
                            <DialogTitle className="flex justify-between items-center text-lg font-bold text-gray-900 mb-4">
                                <span className="text-gray-900">Դուրս գալ</span>
                                <CloseIcon onClick={() => setOpenModal(false)} className="cursor-pointer text-gray-900" />
                            </DialogTitle>

                            <Description className="mt-2 text-sm text-gray-900">
                                Ուզու՞մ եք դուրս գալ
                            </Description>

                            <div className="mt-6 flex justify-end gap-4">
                                <Button variant="cancel" onClick={() => setOpenModal(false)}>Չեղարկել</Button>
                                <Button onClick={handleLogout}>Դուրս գալ</Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
