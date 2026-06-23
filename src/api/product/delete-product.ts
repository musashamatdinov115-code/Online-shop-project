import { apiClient } from "../api";

export async function deleteProductId(id : string) : Promise<boolean> {
    await apiClient.delete(`/products/${id}`, {})
    return true
}