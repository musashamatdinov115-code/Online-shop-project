import { apiClient } from "./api/api";
// import { getCategories, getcategory } from "./api/product-category";
import { getProducts } from "./api/utils";
import type { TypeCategories, TypeContent } from "./utils/types";

const cartRender = document.querySelector("#grid-card") as HTMLDivElement
const filterBtn = document.querySelectorAll(".category-item")
const searchInput = document.querySelector(".search")
const categoryBtn = document.querySelector("#category-list") as HTMLUListElement


searchInput?.addEventListener("input", async (e: Event) => {
  searchInput.innerHTML = "Product not found"
  const target = e.target as HTMLInputElement
  const value: string = target.value.trim()
  const { data } = await apiClient.get(`/products?q=${value}`)
  renderProducts(data.data);
})

function renderCategory () {
  categoryBtn.innerHTML += `
    <li class="category-item category-select" data-category="All">All</li>
    `
  filterBtn.forEach((item) => {
    
    item.addEventListener("click", (e) => {
      filterBtn.forEach(item => item.classList.remove("category-select"))
      item.classList.add("category-select")
      const target = e.target as HTMLLIElement
      console.log(target);
      
    })
  })
}

renderCategory()

// filterBtn.forEach(item => {
//   item.addEventListener("click", (e) => {
//     filterBtn.forEach(button => button.classList.remove("category-select"))
//     item.classList.add("category-select")
//     const target = e.target as HTMLLIElement
//     const selectedCategory = target.dataset.category
//     if (selectedCategory) {
//       getcategory(selectedCategory)
//     }
//   })
// })

export function renderProducts(products: TypeContent[]) {
  cartRender.innerHTML = ""
  if(products.length === 0) {
    cartRender.innerHTML = `
      <div class="not-found"> 
        <p>Product not found</p>
      </div>
    `
  }
  products.forEach((data: TypeContent) => {
    cartRender.innerHTML += `
        <div class="product-card" id="product-card">
            <div class="heart-cart"><i class="fa-regular fa-heart"></i></div>
            <div class="img-card"> <img src="${data.imageUrl}" alt=""> </div>
            <div class="title">
              <p class="title-product">${data.category}</p>
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