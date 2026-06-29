import { apiClient } from "../api";

export async function updateProduct(id: string, formData: FormData): Promise<boolean> {
    try {
        const { data } = await apiClient.patch(`/products/${id}`, formData);
        console.log(data);
        
        return true;
    } catch (error) {
        console.error("Update qáte:", error);
        return false;
    }
}