import {LockReset, More, PersonAddAlt1, PersonRemove} from '@mui/icons-material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material'
import {Button} from "../../components/button";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {CreateTeacherRequest, Page, UserResponse} from "../../shared/models";
import {api} from "../../shared/api";
import LoadingPage from "../loading";
import CreateTeacherModal from "../../modals/createTeacherModal";
import {DeleteTeacherModal} from "../../modals/deleteTeacherModal";

export default function AdminTeachers() {
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [changed, setChanged] = useState<boolean>(false);

    const [createTeacherModalOpen, setCreateTeacherModalOpen] = useState(false);
    const [deleteTeacherModalOpen, setDeleteTeacherModalOpen] = useState(false);

    const [selectedId, setSelectedId] = useState<string>('');

    const [teachers, setTeachers] = useState<UserResponse[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [total, setTotal] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            return await api.get<Page<UserResponse>>(`core/v1/admin/teachers/page?page=${page}&size=${rowsPerPage}`);
        };
        fetch().then((res) => {
            setLoading(false);
            setTeachers(res.data.content);
            setTotal(res.data.page.totalElements)
            setPageCount(res.data.page.totalPages)
        });
    }, [changed, page, rowsPerPage]);

    if (loading) {
        return <LoadingPage/>;
    }

    const handleCreateTeacher = async (data: CreateTeacherRequest) => {
        await api.post(`core/v1/admin/teachers`, {
            "fullName": data.fullName,
            "password": data.password,
            "email": data.email,
            "phone": data.phone,
        }).then(() => {
            setChanged(!changed);
        })
    }

    const handleDeleteTeacher = async (id: string) => {
        await api.delete(`core/v1/admin/teachers/${id}`).then(() => {
            setChanged(!changed);
        })
    }


    return (
        <div className="min-h-screen bg-background p-0">
            <DeleteTeacherModal open={deleteTeacherModalOpen} setOpenModal={setDeleteTeacherModalOpen} onRemove={handleDeleteTeacher} idToRemove={selectedId}/>
            <CreateTeacherModal open={createTeacherModalOpen} setOpenModal={setCreateTeacherModalOpen} onCreate={handleCreateTeacher}/>
            <main className="container mx-auto px-1 py-8">
                <TableContainer className="mb-4 bg-[#212960]/80">
                    <Table sx={{minWidth: 650}}>
                        <TableHead className="bg-[#212960]">
                            <TableRow>
                                <TableCell>Անուն Ազգանուն</TableCell>
                                <TableCell align="right">Էլ. հասցե</TableCell>
                                <TableCell align="right">Հեռախոսահամար</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teachers?.map((teacher, index) => (
                                    <TableRow
                                        className={(index % 2 === 0) ? "bg-[#212960]/30" : ""}>
                                        <TableCell>{teacher.fullName}</TableCell>
                                        <TableCell align="right">{teacher.email}</TableCell>
                                        <TableCell align="right">{teacher.phone}</TableCell>
                                        <TableCell align="right">
                                            <Button className="bg-[#1B84FF]/40" onClick={() => history(teacher.id)}>
                                                <p>Տեսնել առարկաները</p>
                                                <More className="rotate-180"/>
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button className="mr-2"><LockReset/></Button>
                                            <Button variant="remove" onClick={() => {
                                                setSelectedId(teacher.id);
                                                setDeleteTeacherModalOpen(true);
                                            }}>
                                                <PersonRemove/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage="Տողերի քանակը էջում"
                        labelDisplayedRows={({ page }) => `${page + 1}/${pageCount}`}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[2, 8, 16, 24]}
                        className="bg-[#212960]/80 text-[#f9f9f9]"
                        size="medium"

                    />
                </TableContainer>
                <div className="flex flex-row items-end justify-end space-x-5">
                    <Button onClick={() => {
                        setCreateTeacherModalOpen(true)
                    }}>
                        <p>Ավելացնել Դասախոս</p>
                        <PersonAddAlt1/>
                    </Button>
                </div>
            </main>
        </div>
    )
}