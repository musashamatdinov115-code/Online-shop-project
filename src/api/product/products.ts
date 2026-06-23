import type { AxiosResponse } from "axios";
import { apiClient } from "../api";
import type { TypeContent } from "../../utils/types";


export async function getApiProducts(): Promise<TypeContent[]> {
    const {data} = await apiClient.get<AxiosResponse<TypeContent[]>>("/products")
    return data.data
}