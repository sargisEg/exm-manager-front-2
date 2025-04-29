import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8088/api'
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('u_s');
                const response = await axios.post('http://localhost:8088/api/auth/v1/refresh', {
                    refreshToken: refreshToken,
                    email: localStorage.getItem('u_e'),
                });

                const newAccessToken = response.data.token;
                const newRefreshToken = response.data.refreshToken;

                localStorage.setItem('u_t', newAccessToken);
                localStorage.setItem('u_s', newRefreshToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                onRefreshed(newAccessToken);
                return api(originalRequest);

            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('u_t');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
