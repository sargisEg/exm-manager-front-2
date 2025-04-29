import {Admin, Resource, CustomRoutes} from 'react-admin';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import {MyLayout} from './layout';

import {authProvider} from './providers/authProvider';
import {dataProvider} from './providers/dataProvider';

import Login from './pages/login';

import StudentCourses from './pages/student/courses';
import StudentExams from "./pages/student/exams";
import StudentDashboard from "./pages/student/dashboard";

import TeacherExams from "./pages/teacher/exams";
import TeacherExamDetails from "./pages/teacher/examDetails";
import TeacherGroups from "./pages/teacher/groups";
import TeacherGroupDetails from "./pages/teacher/groupDetails";
import TeacherCalendar from "./pages/teacher/calendar";
import TeacherExamGrade from "./pages/teacher/examGrade";

import AdminGroups from './pages/admin/groups';
import AdminGroupDetails from "./pages/admin/groupDetails";
import AdminTeachers from "./pages/admin/teachers";
import AdminTeacherDetails from "./pages/admin/teachersDetails";
//
// import StudentCourseDetails from './pages/student/student-course-details';
// import TeacherCourseDetails from './pages/teacher/teacher-course-details';
//
// import DepartmentDetails from './pages/admin/department-details';
// import TeacherGroupDetails from './pages/teacher/teacher-group-details';
// import StudentDetails from './pages/admin/student-details';
// import TeacherDetails from './pages/admin/teacher-details';
//
// import UngradedExams from './pages/teacher/ungraded-exams';
// import TeacherSubgroupDetails from './pages/teacher/teacher-subgroup-details';
// import AdminGroupDetails from './pages/admin/admin-group-details';
// import AdminSubgroupDetails from './pages/admin/admin-subgroup-details';


function App() {
    return (
            <BrowserRouter>
                <Admin
                    layout={MyLayout}
                    dataProvider={dataProvider}
                    authProvider={authProvider}
                    loginPage={Login}
                >
                    <CustomRoutes>
                        <Route path="/student/courses/:yearNumber" element={<StudentCourses/>}/>
                        <Route path="/student/exams" element={<StudentExams/>}/>
                        <Route path="/student/dashboard" element={<StudentDashboard/>}/>

                        <Route path="/teacher/calendar" element={<TeacherCalendar/>}/>
                        <Route path="/teacher/exams" element={<TeacherExams/>}/>
                        <Route path="/teacher/exams/:courseId" element={<TeacherExamDetails/>}/>
                        <Route path="/teacher/exams/:courseId/grade/:examId" element={<TeacherExamGrade/>}/>
                        <Route path="/teacher/groups" element={<TeacherGroups/>}/>
                        <Route path="/teacher/groups/:groupId" element={<TeacherGroupDetails/>}/>

                        <Route path="/admin/groups" element={<AdminGroups/>}/>
                        <Route path="/admin/groups/:groupId" element={<AdminGroupDetails/>}/>
                        <Route path="/admin/teachers" element={<AdminTeachers/>}/>
                        <Route path="/admin/teachers/:teacherId" element={<AdminTeacherDetails/>}/>
                        {/*<Route path="/teacher" element={<TeacherDashboard />} />*/}

                        {/*<Route path="/ungraded-exams" element={<UngradedExams />} />*/}

                        {/*<Route path="/department/:departmentId" element={<DepartmentDetails />} />*/}
                        {/*<Route path="/department/:departmentId/admin-group/:groupId" element={<AdminGroupDetails />} />*/}
                        {/*<Route*/}
                        {/*    path="/department/:departmentId/admin-group/:groupId/admin-subgroup/:subgroupId"*/}
                        {/*    element={<AdminSubgroupDetails />}*/}
                        {/*/>*/}

                        {/*<Route path="/student/:studentId" element={<StudentDetails />} />*/}
                        {/*<Route path="/teacher/:teacherId" element={<TeacherDetails />} />*/}
                        {/*<Route*/}
                        {/*    path="/department/:departmentId/teacher-group/:groupId"*/}
                        {/*    element={<TeacherGroupDetails />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/department/:departmentId/teacher-group/:groupId/teacher-subgroup/:subgroupId"*/}
                        {/*    element={<TeacherSubgroupDetails />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/department/:departmentId/teacher-group/:groupId/teacher-course/:courseId"*/}
                        {/*    element={<TeacherCourseDetails />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/department/:departmentId/student-group/:groupId/student-course/:courseId"*/}
                        {/*    element={<StudentCourseDetails />}*/}
                        {/*/>*/}
                    </CustomRoutes>
                </Admin>
            </BrowserRouter>
    );
}

export default App;
