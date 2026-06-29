import { renderProducts, updateAuth } from "../../main";
import { getMe } from "../auth/get-me";
import { getApiProducts } from "../product/products";

export async function getProducts() {
  try {
    const data = await getApiProducts()
    if (data) {
      await renderProducts(data)
    }
  } catch (error) {
    console.log("getProducts ishınde dynamic qátelık:", error)
    await renderProducts([])
  }
}

export async function checkUser() : Promise<void> {
  const token = localStorage.getItem("token")
  if(token) {
    const user = await getMe()   
    if(user) {
      updateAuth(true , user.name, user.email)
      return
    }
  }
  updateAuth(false)
}