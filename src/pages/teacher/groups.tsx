import {Card, CardHeader, CardTitle} from "../../components/card";
import {useNavigate} from "react-router-dom";
import {GroupResponse} from "../../shared/models";
import {useEffect, useState} from "react";
import {api} from "../../shared/api";
import LoadingPage from "../loading";

export default function TeacherGroups() {
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<GroupResponse[]>([]);

    useEffect(() => {
        setLoading(true);
        const fetch = async () => {
            const response = await api.get<GroupResponse[]>(`core/v1/groups`)
            setGroups(response.data);
        };
        fetch().then(() => setLoading(false));
    }, []);

    if (loading) {
        return <LoadingPage/>;
    }

    const groupsData: Record<string, GroupResponse[]> = {};

    groups.forEach((group: GroupResponse) => {
        if (!groupsData[group.academicYear]) {
            groupsData[group.academicYear] = [];
        }
        groupsData[group.academicYear].push(group);
    })

    return (
        <div className="min-h-screen bg-background p-0">
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
            </main>
        </div>
    )
}