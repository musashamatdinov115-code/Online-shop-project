import type { AxiosResponse } from "axios";
import type { typeContent } from "../utils/types";
import { apiClient } from "./api";


export async function getApiProducts(): Promise<typeContent[]> {
    const {data} = await apiClient.get<AxiosResponse<typeContent[]>>("/products")
    return data.data
}