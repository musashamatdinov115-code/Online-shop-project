import type { Product, TypeContent } from "../../utils/types";
import { apiClient } from "../api";

export async function NewProduct(formData : FormData) : Promise<TypeContent> {
    const {data} = await apiClient.post('/products', formData)
    return data.data
}

export async function getMyProducts() : Promise<Product[]> {
    const {data} = await apiClient.get('/products/mine') 
    return data.data
}
