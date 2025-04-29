import {JwtPayload} from "jwt-decode";
import {number} from "react-admin";

export enum UserRole {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMIN = "ADMIN"
}

export enum ExamStatus {
    UPCOMING = "UPCOMING",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
    CANCELED = "CANCELED"
}

export enum ExamType {
    MIDTERM = "MIDTERM",
    GENERAL = "GENERAL",
    REPEAT = "REPEAT"
}

export const examTypeLabels: Record<ExamType, string> = {
    [ExamType.MIDTERM]: 'Միջանկյալ',
    [ExamType.GENERAL]: 'Վերջնական',
    [ExamType.REPEAT]: 'Վերաքննություն',
};

export interface MyJwtPayload extends JwtPayload {
    role: string;
    email: string;
    id: string;
    fullName: string;
}

export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: UserRole;
}

export interface StudentResponse {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    subgroup: SubgroupResponse;
}

export interface TeacherResponse {
    user: UserResponse;
    courses: CourseResponse[];
}

export interface GroupResponse {
    id: string;
    name: string;
    academicYear: number;
    startYear: number;
    endYear: number;
}

export interface CourseResponse {
    id: string;
    name: string;
    semester: number;
    group: GroupResponse;
    teacher: UserResponse;
}

export interface SubgroupResponse {
    id: string;
    name: string;
    group: GroupResponse;
}

export interface MaterialResponse {
    id: string;
    name: string;
    courseId: string;
    size: number;
}

export interface ExamResponse {
    id: string;
    title: string;
    course: CourseResponse;
    subgroup: SubgroupResponse;
    location: string;
    startDate: number;
    endDate: number;
    maxPoints: number;
    isGraded: boolean;
    status: ExamStatus;
    type: ExamType;
}

export interface ExamResultResponse {
    id: string;
    exam: ExamResponse;
    studentId: string;
    points: number;
}

export interface CreateGroupRequest {
    name: string;
    startYear: number;
    endYear: number;
}

export interface CreateStudentRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    subgroupId: string;
}

export interface CreateTeacherRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface CreateExamRequest {
    title: string;
    courseId: string;
    subgroupId: string
    location: string;
    startDate: number;
    endDate: number;
    maxPoints: number;
    type: ExamType;
}

export interface UpdateExamRequest {
    title: string;
    location: string;
    startDate: number;
    endDate: number;
    maxPoints: number;
}

export interface Page<T> {
    content: T[];
    page: {
        totalElements: number;
        totalPages: number;
    }
}