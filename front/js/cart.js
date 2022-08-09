// Main

async function Main() {
  updatePage();
}

Main();

// Functions store
async function updatePage() {
  let totalPrice = 0;
  let totalQuantity = 0;
  let cart = JSON.parse(localStorage.getItem("cart"));

  clearData();

  for (product of cart["productList"]) {
    item = await fetchItem(product.id);
    injectData(item, product.color, product.quantity);
    totalPrice += item.price * product.quantity;
    totalQuantity += product.quantity;
  }
  injectTotal(totalPrice, totalQuantity);

  for (element of document.getElementsByClassName("deleteItem")) {
    element.addEventListener("click", function (event) {
      deleteItem(event);
      updatePage();
    });
  }

  for (element of document.getElementsByClassName("itemQuantity")) {
    element.addEventListener("change", function (event) {
      changeQuantity(event);
      updatePage();
    });
  }
}

async function fetchItem(id) {
  return await fetch("http://localhost:3000/api/products/" + id)
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
    })
    .catch((err) => {
      console.log(err);
      return nil;
    });
}

function injectData(product, color, quantity) {
  const newItem = document.createElement("article");
  newItem.className = "cart__item";
  newItem.dataset["id"] = `${product._id}`;
  newItem.dataset["color"] = `${color}`;
  newItem.innerHTML = `
  <div class="cart__item__img">
    <img src="${product.imageUrl}" alt="${product.altTxt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${product.name}</h2>
      <p>${color}</p>
      <p>${product.price} €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
       <p>Qté : </p>
       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>`;
  let element = document.getElementById("cart__items");
  element.appendChild(newItem);
}

function injectTotal(price, quantity) {
  document.getElementById("totalQuantity").innerHTML = quantity;
  document.getElementById("totalPrice").innerHTML = price;
}

function clearData() {
  let element = document.getElementById("cart__items");
  element.innerHTML = "";
}

function deleteItem(event) {
  let element = event.target;
  let id = element.closest(".cart__item").dataset.id;
  let color = element.closest(".cart__item").dataset.color;
  let productList = fetchCart();
  newList = productList.filter(function (item) {
    return item.id != id || item.color != color;
  });
  setCart(newList);
}

function changeQuantity(event) {
  let element = event.target;
  let id = element.closest(".cart__item").dataset.id;
  let color = element.closest(".cart__item").dataset.color;
  let quantity = event.target.value;
  let productList = fetchCart();
  index = productList.findIndex((el) => {
    return (el.id == id && el.color == color);
  });
  productList[index].quantity = quantity;
  setCart(productList);
}

function fetchCart() {
  if (localStorage.getItem("cart") == null) {
    let emptyList = JSON.stringify({ productList: [] });
    localStorage.setItem("cart", emptyList);
  }
  return JSON.parse(localStorage.getItem("cart"))["productList"];
}

function setCart(productList) {
  cart = { productList: productList };
  localStorage.setItem("cart", JSON.stringify(cart));
}
