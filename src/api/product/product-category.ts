import { renderProducts } from "../../main";
import type { TypeCategories, TypeCategory } from "../../utils/types";
import { apiClient } from "../api";


export async function getCategories(): Promise<string[]> {
    const { data } = await apiClient.get<TypeCategories>("/products/categories")
    return data.data
}

export async function getcategory(categoryName : string) : Promise<void> {
    const url = categoryName === `All`? `/products` : `/products?category=${categoryName}`
    const {data} = await apiClient.get<TypeCategory>(url)
    renderProducts(data.data)
}