import {AuthProvider} from "react-admin";
import axios from 'axios';
import {JwtPayload, jwtDecode} from "jwt-decode";
import {MyJwtPayload} from "../shared/models";

export const authProvider: AuthProvider = {
    login: async ({email, password}) => {
        return await axios(`http://localhost:8088/api/auth/v1/sign-in`, {
            method: 'POST',
            data: {
                email,
                password
            },
            headers: {
                "Origin": "http://localhost:5000"
            }
        }).then((response: any) => {
            console.log(response);
            if (response.status < 200 || response.status >= 300 || response.data === '') {
                throw new Error(response.statusText);
            }
            const decoded = jwtDecode<MyJwtPayload>(response.data.token);
            localStorage.setItem("u_t", response.data.token);
            localStorage.setItem("u_s", response.data.refreshToken);
            localStorage.setItem("u_id", decoded.id);
            localStorage.setItem("u_e", decoded.email);
            localStorage.setItem("u_r", decoded.role);
            localStorage.setItem("u_n", decoded.fullName);

            return response;
        }).catch(err => {
            return err.response;
        });

    },

    logout: async () => {
        localStorage.clear();
        return Promise.resolve();
    },

    checkAuth: async () => {
        const token = localStorage.getItem("u_t");
        if (!token) throw new Error("Not authenticated");
        return Promise.resolve();
    },

    checkError: async (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem("u_t");
            localStorage.removeItem("u_s");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: async () => {
        const user = localStorage.getItem("user");
        if (!user) return Promise.resolve([]);
        const parsed = JSON.parse(user);
        return Promise.resolve(parsed.role);
    },

    getIdentity: async () => {
        const user = localStorage.getItem("user");
        if (!user) return Promise.reject();
        const parsed = JSON.parse(user);
        return Promise.resolve({
            id: parsed.id,
            fullName: parsed.fullName || parsed.email,
            avatar: parsed.avatarUrl || undefined,
        });
    },
};
