import { apiClient } from "../api"

export async function getMe() {
    const {data} = await apiClient.get('/auth/me')
    return data.data
}