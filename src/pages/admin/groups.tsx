import {Card, CardHeader, CardTitle} from "../../components/card";
import {Add} from '@mui/icons-material'
import {useNavigate} from "react-router-dom";
import {Button} from "../../components/button";
import {CreateGroupRequest, GroupResponse} from "../../shared/models";
import {useEffect, useState} from "react";
import {api} from "../../shared/api";
import LoadingPage from "../loading";
import {number} from "react-admin";
import CreateGroupModal from "../../modals/createGroupModal";

export default function AdminGroups() {
    const [openModal, setOpenModal] = useState(false);
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<GroupResponse[]>([]);
    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const response = await api.get<GroupResponse[]>(`core/v1/admin/groups`)
            setGroups(response.data);
        };
        fetch().then(() => setLoading(false));
    }, [changed]);

    if (loading) {
        return <LoadingPage/>;
    }

    const groupsData: Record<string, GroupResponse[]> = {};

    groups.map((group: GroupResponse) => {
        if (!groupsData[group.academicYear]) {
            groupsData[group.academicYear] = [];
        }
        groupsData[group.academicYear].push(group);
    })


    const handleCreateGroup = async (data: CreateGroupRequest) => {
        await api.post('core/v1/admin/groups', {
            "name": data.name,
            "startYear": data.startYear,
            "endYear": data.endYear,
        }).then(() => {
            setChanged(!changed);
        });
    }

    return (
        <div className="min-h-screen bg-background p-0">
            <CreateGroupModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreate={handleCreateGroup}
            ></CreateGroupModal>
            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-12 md:grid-cols-1 mb-8">
                    {
                        Object.keys(groupsData).map((key: string) => {
                            return (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                {parseInt(key) > 4 ? "Մագիստրատուրա " + (parseInt(key) -4) : "Բակալավր " + key}
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                    <div className="grid gap-12 md:grid-cols-4 mb-8">
                                        {
                                            groupsData[key].map((group: GroupResponse) => (
                                                <Card className="bg-[#212960]/80 hover:bg-[#1B84FF] hover:cursor-pointer"
                                                      onClick={() => {
                                                          history(group.id)
                                                      }}>
                                                    <CardHeader>
                                                        <CardTitle>
                                                            {group.name}
                                                        </CardTitle>
                                                    </CardHeader>
                                                </Card>
                                            ))
                                        }
                                    </div>
                                </>
                            );
                        })
                    }
                </div>
                <div className="flex flex-row justify-end space-x-5 p-1 items-center">
                    <Button onClick={() => setOpenModal(true)}>
                        <p>Ավելացնել նոր խումբ</p>
                        <Add/>
                    </Button>
                </div>
            </main>
        </div>
    )
}