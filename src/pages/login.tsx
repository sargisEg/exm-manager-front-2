import {authProvider} from "../providers/authProvider";
import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {useForm} from "react-hook-form";
import {Card, CardContent, CardHeader, CardTitle} from "../components/card";
import {Label} from "../components/label";
import {Input} from "../components/imput";
import {Button} from "../components/button";
import {jwtDecode} from "jwt-decode";
import {MyJwtPayload} from "../shared/models";

export default function AuthPage() {
    const history = useNavigate();
    const [loading, setLoading] = useState(false);


    const loginForm = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = async (data: { email: string, password: string }): Promise<void> => {
        setLoading(true);

        authProvider.login({
            email: data.email,
            password: data.password,
        }).then((item: { status: number; data: any }) => {
            if (item.status === 200) {
                const decoded = jwtDecode<MyJwtPayload>(item.data.token);
                console.log(decoded);
                if (decoded.role === 'ADMIN') {
                    history('/admin/groups', {replace: true});
                }
                if (decoded.role === 'TEACHER') {
                    history('/teacher/courses', {replace: true});
                }
                if (decoded.role === 'STUDENT') {
                    history('/student/dashboard', {replace: true});
                }
            } else {
                console.log("in else");
                // showNotify('error', item?.data?.message || 'Something went wrong');
            }
        }).catch((err: any) => {
            console.log("in catch");
            // showNotify('error', err?.data?.message || 'Something went wrong');
        }).finally(() => {
            setLoading(false);
        })
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#cce9ff] from-background to-muted flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#212960]">
                            Exam Management
                        </h1>
                        <p className="text-muted-foreground mt-2 text-[#212960]">
                            A comprehensive platform for managing examinations, results, and
                            academic progress.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#212960] flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-[#ffb300]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#212960]">Easy Scheduling</h3>
                                <p className="text-sm text-muted-foreground text-[#212960]">
                                    Efficiently manage and track examination schedules
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#212960] flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-[#ffb300]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#212960]">Result Tracking</h3>
                                <p className="text-sm text-muted-foreground text-[#212960]">
                                    Monitor academic performance and progress
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#f9f9f9]">Welcome</CardTitle>
                    </CardHeader>
                    <CardContent>
                                <form
                                    onSubmit={loginForm.handleSubmit((data) =>
                                        handleSubmit(data)
                                    )}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="eamil" className="text-[#f9f9f9]">Email</Label>
                                        <Input
                                            id="eamil"
                                            className="bg-[#f9f9f9] text-black"
                                            {...loginForm.register("email")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[#f9f9f9]">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            className="bg-[#f9f9f9] text-black"
                                            {...loginForm.register("password")}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
