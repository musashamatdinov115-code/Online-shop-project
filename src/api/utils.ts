import { renderProducts } from "../main";
import { getApiProducts } from "./products";

export async function getProducts() {
  try {
    const data = await getApiProducts()
    renderProducts(data);

  } catch (error) {
    console.log(error);

  }
}