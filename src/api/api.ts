import axios from "axios";

export const apiClient = axios.create({
    baseURL:"https://online-shop-auth-api.onrender.com/api"
})