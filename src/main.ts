import { getApiProducts } from "./api/products";

async function getProducts() {
    try {
        const data = await getApiProducts()
        console.log(data);
        
    } catch (error) {
        console.log(error);
        
    }
}

getProducts()