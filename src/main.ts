import { getApiProducts } from "./api/products";
import type { TypeContent } from "./utils/types";

const cartRender = document.querySelector("#grid-card") as HTMLDivElement

async function getProducts() {
    try {
        const data = await getApiProducts()
        renderProducts(data);
        
    } catch (error) {
        console.log(error);
        
    }
}

function renderProducts(products : TypeContent[]) {
    cartRender.innerHTML = ""
    products.forEach(data => {
        cartRender.innerHTML += `
        <div class="product-card" id="product-card">
            <div class="heart-cart"><i class="fa-regular fa-heart"></i></div>
            <div class="img-card"> <img src="${data.imageUrl}" alt=""> </div>
            <div class="title">
              <p class="title-product">${data.title}</p>
              <h3 class="text-product">${data.description} </h3>
              <div class="shop">
                <p class="price">$${data.price}</p>
                <button class="btn btn-add">
                  <div class="select"><i class="fa-solid fa-cart-plus"></i></div>
                  <p class="add">Add to cart</p>
                </button>
              </div>
            </div>
          </div>
        `
    });
} 

getProducts()