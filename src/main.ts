import { getMyProducts, NewProduct } from "./api/product/new-product";
import { apiClient } from "./api/api";
import { loginPost, registerPost } from "./api/auth/auth";
import { deleteFavorites, getFavorites, toggleLike } from "./api/favorites/favorites";
import { getCategories, getcategory } from "./api/product/product-category";
import { checkUser, getProducts } from "./api/other/utils";
import type { CartItem, FavoriteProduct, Product, TypeContent } from "./utils/types";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { deleteProductId } from "./api/product/delete-product";
import { addToCart, getCartProducts } from "./api/product/addCart";



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
const myProducts = document.querySelector("#my-products") as HTMLDivElement
const beforeLogin = document.querySelector("#before-login") as HTMLDivElement
const quantityCount = document.querySelector("#quantity-count") as HTMLDivElement
const logoutBtn = document.querySelector(".logout")
const formSell = document.querySelector("#form-input-sell") as HTMLFormElement


const showMyProducts = document.querySelector("#products-modal") as HTMLDivElement
const showNewcard = document.querySelector("#add-new") as HTMLDivElement
const showProductShop = document.querySelector("#shop-product") as HTMLDivElement
const showFavourite = document.querySelector("#my-favorites") as HTMLDivElement

let currentCount = 0

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
    return
  }
  products.forEach((data: TypeContent) => {
    cartRender.innerHTML += `
        <div class="product-card" id="product-card">
            <div id="heart-cart" class="heart-cart " data-id="${data.id}"><i class="fa-regular fa-heart"></i></div>
            <div class="img-card"> <img src="${data.imageUrl}" alt=""> </div>
            <div class="title">
              <p class="title-product">${data.category}</p>
              <h3 class="text-product">${data.description} </h3>
              <div class="shop">
                <p class="price">$${data.price}</p>
                <button class="btn btn-add">
                  <div class="select"><i class="fa-solid fa-cart-plus"></i></div>
                  <p class="add" data-id="${data.id}">Add to cart</p>
                </button>
              </div>
            </div>
          </div>
        `
  });
}

cartRender.addEventListener("click", async (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const heartBtn = target.closest("#heart-cart")
  if (!heartBtn) return
  const productId = heartBtn.getAttribute("data-id")
  const icon = heartBtn.querySelector("i")
  if (!productId || !icon) return
  if (icon.classList.contains("fa-regular")) {
    await handleLike(productId, icon)
  } else {
    await handleDislike(productId, icon)
  }

  await renderFavorites()
})

async function init() {
  const currentFavorites = await renderFavorites()
  await getProducts()
  if (currentFavorites) {
    const favIds = currentFavorites.map((item: any) => item.id);
    document.querySelectorAll(".heart-cart").forEach((btn) => {
      const id = btn.getAttribute("data-id");
      if (id && favIds.includes(id)) {
        const icon = btn.querySelector("i");
        if (icon) {
          icon.classList.replace("fa-regular", "fa-solid");
          icon.style.color = "red";
        }
      }
    })
  }
}
init()
async function handleLike(productId: string, icon: HTMLElement) {
  await toggleLike(productId)
  if (quantityCount) quantityCount.innerHTML = currentCount.toString()
  icon.classList.replace("fa-regular", "fa-solid")
  icon.style.color = "red"
  currentCount++
}
async function handleDislike(productId: string, icon: HTMLElement) {
  await deleteFavorites(productId)
  if (quantityCount) quantityCount.innerHTML = currentCount.toString()
  icon.classList.replace("fa-solid", "fa-regular")
  icon.style.color = ""
  currentCount--
}

const favoritesModal = document.querySelector("#favorite-content-modal") as HTMLDivElement

if (favoritesModal) {
  favoritesModal.addEventListener("click", async (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const favHeartBtn = target.closest("#fav-heart-btn")
    if (!favHeartBtn) return
    const productId = favHeartBtn.getAttribute("data-id")
    if (!productId) return
    await deleteFavorites(productId)
    const mainIcon = document.querySelector(`#grid-card #heart-cart[data-id="${productId}"] i`)
    if (mainIcon) {
      mainIcon.classList.replace("fa-solid", "fa-regular");
      (mainIcon as HTMLElement).style.color = ""
    }
    await renderFavorites()
  });
}



async function renderFavorites() {
  const favoritesCart = document.querySelector("#favorite-content-modal")
  if (!favoritesCart) return []
  const favProducts = await getFavorites()
  favoritesCart.innerHTML = ''
  currentCount = favProducts.length
  if (favProducts.length === 0) {
    favoritesCart.innerHTML = `
      <div class="not-favorites"> 
        <p>No fav0rites yet.</p>
      </div>
    `
    if (quantityCount) quantityCount.innerHTML = "0"
    return favProducts
  }
  if (quantityCount) {
    quantityCount.innerHTML = currentCount.toString();
  }

  favProducts.forEach((item: FavoriteProduct) => {
    favoritesCart.innerHTML += `
      <div class="favorite-content-modal" id="fav-${item.id}">
        <div class="img-content-modal">
          <img src="${item.imageUrl}" alt="">
        </div>
        <div class="title-content-modal">
          <div class="content-text-modal">
            <p>${item.title}</p>
            <div class="heart-cart" id="fav-heart-btn" data-id="${item.id}"><i class="fa-regular fa-heart"></i></div>
          </div>

          <p>${item.category}</p>

          <p class="price-modal">$${item.price}</p>
        </div>
      </div>
    `
  })
  return favProducts
}
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
      showLnRBtn.classList.add("noactive")
      lnRModal.classList.remove("show-login")
      profileBtn.classList.add("active")
      localStorage.setItem("token", token)
      const loggedInUser = localStorage.getItem("username") || email.split('@')[0];
      localStorage.setItem("username", loggedInUser);
      localStorage.setItem("useremail", email)
      updateAuth(true, loggedInUser);
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
      localStorage.setItem("token", token)
      localStorage.setItem("username", nameValue)
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

profileBtn.addEventListener("click", () => {
  arrow?.classList.add("active")
  profileLogin.classList.add("show-profile")

})
document.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const clickModal = target.closest(".modal-overlay") as HTMLDivElement
  if (clickModal) {
    const insideCart = target.closest(".profile-modal, .modal-verify, .profile-modal, .modal-content")
    if (!insideCart) {
      clickModal.classList.forEach((className) => {
        if (className.startsWith("show-")) {
          clickModal.classList.remove(className)
        }
      })
      arrow.classList.remove("active")
    }
  }


})

myProducts?.addEventListener("click", () => {
  showMyProducts?.classList.add("show-products")
  beforeLogin.classList.remove("show-profile")
})

const profileIcon = document.querySelector(".profile-icon")
const profileName = document.querySelector(".profile-name")
const userName = document.querySelector("#user-modal")
const emailName = document.querySelector("#email-modal")



export const updateAuth = (isLogged: boolean, username: string = "", email: string = "") => {
  showLnRBtn.classList.toggle("noactive", isLogged)
  profileBtn.classList.toggle("active", isLogged)
  if (isLogged && username) {
    if (profileName) profileName.textContent = username
    if (profileIcon) profileIcon.textContent = username[0].toUpperCase()

    if (userName) userName.textContent = username
    if (emailName) emailName.textContent = email
  }
}

logoutBtn?.addEventListener("click", () => {
  localStorage.clear()
  updateAuth(false)
  profileLogin.classList.remove("show-profile")
})

const file = document.querySelector("#file") as HTMLInputElement
const myProductsPending = document.querySelector("#my-products-pending")

formSell?.addEventListener("submit", async (e: Event) => {
  e.preventDefault()
  const formData = new FormData()
  formData.append("title", (formSell.querySelector("#title") as HTMLInputElement).value)
  formData.append("category", (formSell.querySelector("#category") as HTMLInputElement).value)
  formData.append("price", (formSell.querySelector("#price") as HTMLInputElement).value)
  formData.append("description", (formSell.querySelector("#description") as HTMLInputElement).value)
  if (file?.files?.[0]) {
    formData.append("image", file.files[0])
  }
  const success = await NewProduct(formData)
  console.log(success);

  if (success) {
    Toastify({
      text: "Product submitted for review!",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "#2ecc71",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }
    }).showToast();
    renderMyProducts()
    formSell.reset()
    showAddModal.classList.remove("show-sell-product")
  } else {
    Toastify({
      text: "Failed to create product",
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

async function renderMyProducts() {
  if (!myProductsPending) return
  const products = await getMyProducts()
  myProductsPending.innerHTML = ''
  if (products.length === 0) {
    myProductsPending.innerHTML = '<p style="text-align:center;">No products found.</p>'
    return
  }
  products.forEach((item: Product) => {
    myProductsPending.innerHTML += `
    <div class="products-content-modal" id="products-${item.id}">
        <div class="img-content-modal">
          <img src="${item.imageUrl}" alt="">
        </div>
        <div class="title-content-modal fav">
          <p class="text">${item.title}</p>
          <p>${item.category} · $${item.price}</p>  
          <p class="pending-approved" id="verify-product">${item.status}</p>         
          <div class="product-btns">     
            <button class="edit"><i class="fa-solid fa-pen"></i><p>Edit</p></button>
           <button class="delete" data-id="${item.id}"><i class="fa-solid fa-trash"></i><p>Delete</p></button>   
          </div>
        </div>
        </div>
      `
  })
}



myProductsPending?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement
  const delteBtn = target.closest(".delete") as HTMLElement
  if (!delteBtn) return
  const productId = delteBtn.getAttribute("data-id")
  if (!productId) return
  const deleted = await deleteProductId(productId)
  if (deleted) {
    const productCart = document.querySelector(`#products-${productId}`)
    productCart?.remove()
    Toastify({
      text: "Deleted!",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "#e74c3c",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }
    }).showToast();
  }
})
renderMyProducts()
checkUser()
getProducts()

cartRender.addEventListener("click", async (e : MouseEvent) => {
  const target = e.target as HTMLElement

  const addBtn = target.closest(".add")
  if(!addBtn) return
  const productId = addBtn.getAttribute("data-id")
  if (!productId) return
  await addToCart(productId)
  await renderCart()
})

async function renderCart() : Promise<void> {
  const cartModal = document.querySelector("#modal-cart")
  if(!cartModal) return
  const cartProducts = await getCartProducts()
  cartModal.innerHTML = ""
  let totalPrice = 0
  cartProducts.forEach((item : CartItem) => {
    totalPrice += item.product.price * item.qty

    cartModal.innerHTML += `
      <div class="favorite-content-modal" data-id="${item.product.id}">
          <div class="img-content-modal">
            <img src="${item.product.imageUrl}" alt="">
          </div>
          <div class="title-content-modal fav">
            <p class="text">${item.product.title}</p>
            <p>Electronics</p>
            <p class="price-modal">$${(item.product.price * item.qty).toFixed(2)}</p>

            <div class="df-card">
              <div class="plus-minus" data-id="${item.product.id}">
                <button class="quantity-btn minus-btn"><i class="fa-solid fa-minus"></i></button>
                <input type="text" class="quantity-count" value="${item.qty}" readonly>
                <button class="quantity-btn plus-btn"><i class="fa-solid fa-plus"></i></button>
              </div>
              <div class="delete" data-id=""><i class="fa-solid fa-trash"></i></div>
            </div>
          </div>
        </div>
    `
  })
  const totalElement = document.querySelector("#total-price");
    if (totalElement) totalElement.innerHTML = `$${totalPrice.toFixed(2)}`
}

getCartProducts()