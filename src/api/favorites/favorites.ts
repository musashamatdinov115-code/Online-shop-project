import { favoritesCount } from "../../main";
import type { FavoriteProduct, FavoritesResponse } from "../../utils/types";
import { apiClient } from "../api";

export async function getFavorites() : Promise<FavoriteProduct[]> {
    const token = localStorage.getItem("token")
    if(!token) {
        console.log("login bolmag'ansiz!");
    }
    const {data} = await apiClient.get<FavoritesResponse>(`/favorites`)
   return data.data 
}

export async function toggleLike(productId : string) : Promise<void> {
    const res = await apiClient.post(`/favorites/${productId}`, {})
    if(res.status === 200 || res.status === 201) {
        console.log("product liked Id:",productId);
        favoritesCount()
        getFavorites()
    }    
}