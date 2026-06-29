import { apiClient } from "../api";
import type { TypeContent } from "../../utils/types";


export async function getApiProducts(): Promise<TypeContent[]> {
  const { data } = await apiClient.get<{ data: TypeContent[] }>("/products");
  return data.data;
}