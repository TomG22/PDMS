import axios from "axios";

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    refreshSubscribers.push((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        resolve(axios(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/",
                    {
                        refresh: localStorage.getItem("refresh_token"),
                    },
                    { headers: { "Content-Type": "application/json" }, withCredentials: true }
                );

                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);

                onRefreshed(data.access);
                isRefreshing = false;

                originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
                return axios(originalRequest);
            } catch (error) {
                console.error("Token refresh failed:", error);
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
