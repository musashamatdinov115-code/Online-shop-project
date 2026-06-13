import type { AxiosResponse } from "axios";
import type { TypeContent } from "../utils/types";
import { apiClient } from "./api";


export async function getApiProducts(): Promise<TypeContent[]> {
    const {data} = await apiClient.get<AxiosResponse<TypeContent[]>>("/products")
    return data.data
}