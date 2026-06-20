import { apiClient } from "./api/api";
import { loginPost, registerPost } from "./api/auth";
import { getCategories, getcategory } from "./api/product-category";
import { getProducts } from "./api/utils";
import type { TypeContent } from "./utils/types";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";



const cartRender = document.querySelector("#grid-card") as HTMLDivElement
const searchInput = document.querySelector(".search") as HTMLInputElement
const categoryBtn = document.querySelector("#category-list") as HTMLUListElement
const showAddModal = document.querySelector("#sell-modal") as HTMLDivElement
const profileLogin = document.querySelector("#before-login") as HTMLDivElement
const showCardModal = document.querySelector("#cart-modal") as HTMLDivElement
const showFavModal = document.querySelector("#favorite-modal") as HTMLDivElement
const showLnRModal = document.querySelector("#modal-verify") as HTMLDivElement
const showLnRBtn = document.querySelector("#login-user") as HTMLDivElement
const lnRModal = document.querySelector("#LnR-modal") as HTMLDivElement
const profileBtn = document.querySelector("#profile-button") as HTMLButtonElement
const arrow = document.querySelector("#arrow-icon") as HTMLDivElement
const myProducts = document.querySelector("#my-products") as HTMLButtonElement
const beforeLogin = document.querySelector("#before-login") as HTMLDivElement

const showMyProducts = document.querySelector("#products-modal") as HTMLDivElement
const showNewcard = document.querySelector("#add-new") as HTMLDivElement
const showProductShop = document.querySelector("#shop-product") as HTMLDivElement
const showFavourite = document.querySelector("#my-favorites") as HTMLDivElement

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

export function renderProducts(products: TypeContent[]): void {
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

showProductShop?.addEventListener("click", () => {
  showCardModal?.classList.add("show-cart")
})

showFavourite?.addEventListener("click", () => {
  showFavModal?.classList.add("show-fav")
})




const allCloseBtn = document.querySelectorAll(".close-icon-modal")
allCloseBtn.forEach((button): void => {
  button.addEventListener("click", () => {
    const currentModal = button.closest(".modal-overlay")
    if (currentModal) {
      currentModal.classList.forEach((item): void => {
        if (item.includes("show-sell-product") || item.includes("show-cart") || item.includes("show-fav") || item.includes("show-login") || item.includes("show-products")) {
          currentModal.classList.remove(item)
        }
      })
    }
  })
});

function renderLModal(): void {
  showLnRModal.innerHTML = `
    <div class="modal-text">
        <h3>Welcome back</h3>
        <div class="close-icon-modal close-modal">
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

  const closeLnRModal = document.querySelector(".close-modal")
  closeLnRModal?.addEventListener("click", () => {
    lnRModal.classList.remove("show-login")
  })

  const formLogin = document.querySelector("#form-input-login") as HTMLFormElement


  formLogin?.addEventListener("submit", async (e: Event) => {
    e.preventDefault()
    const email = (formLogin.querySelector("#email") as HTMLInputElement).value
    const password = (formLogin.querySelector("#password") as HTMLInputElement).value
    const token = await loginPost(email, password)

    if (token) {
      Toastify({
        text: "Login successful!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#2ecc71",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }
      }).showToast();
      
      lnRModal.classList.remove("show-login")
    } else {
      Toastify({
        text: "Invalid email or password",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#e74c3c",
          borderRadius: "8px"
        }
      }).showToast();
    }
  })
}
function renderRModal(): void {
  showLnRModal.innerHTML = `
    <div class="modal-verify">
      <div class="modal-text">
        <h3>Create account</h3>
        <div class="close-icon-modal close-modal">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <div class="login-form">
        <form class="form-input-login" id="form-input-register">
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
  const closeLnRModal = document.querySelector(".close-modal")
  closeLnRModal?.addEventListener("click", () => {
    lnRModal.classList.remove("show-login")
  })

  const formregister = document.querySelector("#form-input-register") as HTMLFormElement
  formregister.addEventListener("submit", async (e: Event) => {
    e.preventDefault()
    const nameValue = (formregister.querySelector("#name") as HTMLInputElement).value
    const emailValue = (formregister.querySelector("#email") as HTMLInputElement).value
    const passwordValue = (formregister.querySelector("#password") as HTMLInputElement).value

    const token = await registerPost(nameValue, emailValue, passwordValue)

    if (token) {

      Toastify({
        text: "Register successful!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#2ecc71",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }
      }).showToast();
      renderLModal()
    } else {
      Toastify({
        text: "Email already exists!",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#e74c3c",
          borderRadius: "8px"
        }
      }).showToast();
    }
  })


}
showLnRBtn?.addEventListener("click", openModal)

function openModal(): void {
  lnRModal.classList.add("show-login")
  renderLModal()
}

profileBtn.addEventListener("click", (e) => {
  arrow?.classList.add("active")
  profileLogin.classList.add("show-profile")
  
})
document.addEventListener("click", (e:MouseEvent) => {
  const target = e.target as HTMLElement
  const clickModal = target.closest(".modal-overlay") as HTMLDivElement
  if(clickModal) {
    const insideCart = target.closest(".profile-modal, .modal-verify, .profile-modal, .modal-content")
    if(!insideCart){
      clickModal.classList.forEach((className) => {
        if(className.startsWith("show-")) {
          clickModal.classList.remove(className)
        }
      } )
    arrow.classList.remove("active")
    }
  }
   
  
})

myProducts?.addEventListener("click", () => {
  showMyProducts?.classList.add("show-products")
  beforeLogin.classList.remove("show-profile")
})

