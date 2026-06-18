import { apiClient } from "./api/api";
import { getCategories, getcategory } from "./api/product-category";
import { getProducts } from "./api/utils";
import type { TypeContent } from "./utils/types";

const cartRender = document.querySelector("#grid-card") as HTMLDivElement
const searchInput = document.querySelector(".search") as HTMLInputElement
const categoryBtn = document.querySelector("#category-list") as HTMLUListElement
const showAddModal = document.querySelector("#sell-modal") as HTMLDivElement
const showCardModal = document.querySelector("#cart-modal") as HTMLDivElement
const showFavModal = document.querySelector("#favorite-modal") as HTMLDivElement
const showLnRModal = document.querySelector("#modal-verify") as HTMLDivElement
const showLnRBtn = document.querySelector("#login-user")
const lnRModal = document.querySelector("#LnR-modal") as HTMLDivElement

const showNewcard = document.querySelector("#add-new")
const closeSellModal = document.querySelector("#close-icon-modal-sell")

const showProductShop = document.querySelector("#shop-product")
const closeCardModal = document.querySelector("#close-icon-modal-card")

const showFavourite = document.querySelector("#my-favorites")
const closeFavModal = document.querySelector("#close-icon-modal-fav")

searchInput?.addEventListener("input", async (e: Event) => {
  searchInput.innerHTML = "Product not found"
  const target = e.target as HTMLInputElement
  const value: string = target.value.trim()
  const { data } = await apiClient.get(`/products?q=${value}`)
  renderProducts(data.data);
})

async function renderCategory() {


  const categories = await getCategories()
  categoryBtn.innerHTML += `
    <li class="category-item category-select" data-category="All">All</li>
    `
  categories.forEach((item: string) => {
    categoryBtn.innerHTML += `
    <li class="category-item" data-category="${item}">${item}</li>
      `
  })


  const filterBtn = document.querySelectorAll(".category-item")

  filterBtn.forEach((item) => {
    item.addEventListener("click", async (e) => {
      filterBtn.forEach(btn => btn.classList.remove("category-select"))
      item.classList.add("category-select")
      const target = e.target as HTMLLIElement
      const selectedCategory = target.dataset.category
      if (selectedCategory) {
        await getcategory(selectedCategory)
      }
    })
  })
}
renderCategory()

export function renderProducts(products: TypeContent[]) {
  cartRender.innerHTML = ""
  if (products.length === 0) {
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


showNewcard?.addEventListener("click", () => {
  showAddModal?.classList.add("show-sell-product")
})
closeSellModal?.addEventListener("click", () => {
  showAddModal?.classList.remove("show-sell-product")
})

showProductShop?.addEventListener("click", () => {
  showCardModal?.classList.add("show-cart")
})
closeCardModal?.addEventListener("click", () => {
  showCardModal?.classList.remove("show-cart")
})

showFavourite?.addEventListener("click", () => {
  showFavModal?.classList.add("show-fav")
})
closeFavModal?.addEventListener("click", () => {
  showFavModal?.classList.remove("show-fav")
})











function renderLModal() : void {
  showLnRModal.innerHTML = `
    <div class="modal-text">
        <h3>Welcome back</h3>
        <div class="close-icon-modal">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div class="login-form">
        <form class="form-input-login" id="form-input-login">
          <label for="email">Email</label>
          <input type="email" name="email" id="email" placeholder="you@example.com" required>

          <label for="password">Password</label>
          <input type="password" name="password" id="password" placeholder="•••••••" required>

          <button class="login-btn">Login</button>
          <div class="account">
            <p>No account?</p>
            <p class="register-login" id="register">Register</p>
          </div>
        </form>
      </div>
  `

  const register = document.querySelector("#register")
  register?.addEventListener("click", renderRModal)
}
function renderRModal() : void {
  showLnRModal.innerHTML = `
    <div class="modal-verify">
      <div class="modal-text">
        <h3>Create account</h3>
        <div class="close-icon-modal">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div class="login-form">
        <form class="form-input-login" id="form-input-login">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" placeholder="Your Name" required>

          <label for="email">Email</label>
          <input type="email" name="email" id="email" placeholder="you@example.com" required>

          <label for="password">Password</label>
          <input type="password" name="password" id="password" placeholder="•••••••" required>

          <button class="login-btn">Create account</button>
          <div class="account">
            <p>Already registered?</p>
            <p class="register-login" id="Login">Login</p>
          </div>
        </form>
      </div>
    </div>
  `
  const login = document.querySelector("#Login")
  login?.addEventListener("click", renderLModal)
}
showLnRBtn?.addEventListener("click" , openModal)

function openModal() : void {
  lnRModal.classList.add("show-login")
  renderLModal()
}