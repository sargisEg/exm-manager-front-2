import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react'
import {Fragment, useState} from 'react'
import {Input} from "../components/imput";
import {Button} from "../components/button";
import {CreateStudentRequest} from "../shared/models";

interface CreateStudentModalProps {
    open: boolean;
    setOpenModal: (val: boolean) => void;
    onCreate: (data: CreateStudentRequest) => void;
    subgroupId: string;
}

function isValidEmail(email: string) {
    return /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(email);

}


export default function CreateStudentModal({open, setOpenModal, onCreate, subgroupId}: CreateStudentModalProps) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Լրացրեք անունը');
            return;
        }
        if (!surname.trim()) {
            setError('Լրացրեք ազգանունը');
            return;
        }
        if (!email.trim()) {
            setError('Լրացրեք էլ. հասցեն');
            return;
        }
        if (!password.trim()) {
            setError('Լրացրեք գաղտնաբառը');
            return;
        }
        if (!phone.trim()) {
            setError('Լրացրեք հեռախոսահամարը');
            return;
        }

        setError(null);
        onCreate({
            fullName: name + " " + surname,
            email: email,
            phone: phone,
            password: password,
            subgroupId: subgroupId,
        });

        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
        setPhone('');
        setOpenModal(false);
    }

    const handleClose = () => {
        setOpenModal(false);
        setName('');
        setSurname('');
        setEmail('');
        setPassword('');
        setPhone('');
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
                                Ավելացնել նոր ուսանող
                            </DialogTitle>
                            <div className="flex flex-col gap-4">
                                <Input
                                    required
                                    type="text"
                                    placeholder="Անուն"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Input
                                    required
                                    type="text"
                                    placeholder="Ազգանուն"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Input
                                    required
                                    type="email"
                                    placeholder="Էլ. հասցե"
                                    value={email}
                                    onChange={(e) => {
                                        if (!isValidEmail(e.target.value)) {
                                            setError('Անվավեր էլ. հասցե');
                                        } else {
                                            setError(null);
                                        }
                                        setEmail(e.target.value);
                                    }}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Input
                                    required
                                    type="password"
                                    placeholder="Գաղտնաբառ"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
                                <Input
                                    required
                                    type="number"
                                    placeholder="Հեռախոսահամար"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="bg-[#f9f9f9] text-black"
                                />
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
                                    Ավելացնել
                                </Button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
