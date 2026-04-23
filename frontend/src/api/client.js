import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../auth/tokens";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
};

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!error.response || originalRequest._retry || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // if refresh fails
        if (originalRequest.url.includes("/token/refresh/")) {
            clearTokens();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((newAccessToken) => {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });

            const newAccess = response.data.access;
            const newRefresh = response.data.refresh;

            setTokens({ access: newAccess, refresh: newRefresh });

            onRefreshed(newAccess);

            originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
            return api(originalRequest);
        } catch (err) {
            clearTokens();
            window.location.href = "/login";
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;


        
        
    
