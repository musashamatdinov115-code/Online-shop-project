import axios from "axios";

export const apiClient = axios.create({
    baseURL:"https://online-shop-auth-api.onrender.com/api"
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        const publicRoutes = ["/login", "/register"]

        const isPublic = publicRoutes.some(route => {
           config.url ? config.url.includes(route) : false
        })

        if(token && !isPublic){
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }  
)

