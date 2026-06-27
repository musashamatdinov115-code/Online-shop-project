import type { CartApiResponse, CartItem } from "../../utils/types";
import { apiClient } from "../api";

export async function getCartProducts() : Promise<CartItem[]> {
    try {
        const {data} = await apiClient.get<CartApiResponse>("/cart")
        console.log(data);
        
        return data.data.items
        
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function addToCart(productId: string) {
    try {
        await apiClient.post(`/cart/${productId}`)
    } catch (error) {
        console.error(error)
    }
}

export async function updateCartQuantity(productId: string, quantity: number) : Promise<void> {
    try {
        await apiClient.patch(`/api/cart/${productId}`, { quantity })
    } catch (error) {
        console.error(error)
    }
}

export async function removeFromCart(productId: string) {
    try {
        await apiClient.delete(`/cart/${productId}`)
    } catch (error) {
        console.error(error)
    }
}