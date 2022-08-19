// Main

async function Main() {
  updatePage();
  setForm();
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
  if (newList.length == 0) {
    alert("The cart is empty, returning to the index.");
    window.location.href = "./index.html";
    localStorage.removeItem("cart");
  }
}

function changeQuantity(event) {
  let element = event.target;
  let id = element.closest(".cart__item").dataset.id;
  let color = element.closest(".cart__item").dataset.color;
  let quantity = event.target.value;
  if (quantity >= 1 && quantity <= 100) {
    let productList = fetchCart();
    index = productList.findIndex((el) => {
      return el.id == id && el.color == color;
    });
    productList[index].quantity = quantity;
    setCart(productList);
  } else {
    alert("Please enter a number in the range 1~100");
  }
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

function dataCheck(id) {
  switch (id) {
    case "firstName":
      return /^([A-Z]|[ÉÈÇÀÙ]){1}([a-z]|[éèçàù])*(-?([A-Z]|[ÉÈÇÀÙ]){1}([a-z]|[éèçàù])*)*\S$/.test(
        document.getElementById(id).value
      );
    case "lastName":
      return /^([A-Z]|[ÉÈÇÀÙ]){1}([a-z]|[éèçàù])*(-?([A-Z]|[ÉÈÇÀÙ]){1}([a-z]|[éèçàù])*)*\S$/.test(
        document.getElementById(id).value
      );
    case "address":
      return /^[0-9]{1,}((\s|-){1}([A-Z]|[ÉÈÇÀÙ]|[a-z]|[éèçàù]|[0-9]){1,}){1,}$/.test(
        document.getElementById(id).value
      );
    case "city":
      return /^([A-Z]|[ÉÈÇÀÙ])*([a-z]|[éèçàù])*(-?([A-Z]|[ÉÈÇÀÙ])*([a-z]|[éèçàù])*)*\S$/.test(
        document.getElementById(id).value
      );
    case "email":
      return /^([A-Z]|[ÉÈÇÀÙ]|[a-z]|[éèçàù]|[0-9]|\.){1,}@{1}([A-Z]|[ÉÈÇÀÙ]|[a-z]|[éèçàù]|[0-9]){1,}\.{1}[a-z]{1,}/.test(
        document.getElementById(id).value
      );
    default:
      console.log("Unexpected case");
  }
}

function prepareQuery() {
  query = {
    contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    },
    products: [],
  };
  productList = fetchCart();
  for (product of productList) {
    query["products"].push(product.id);
  }
  return JSON.stringify(query);
}

function setForm() {
  form = document.getElementsByClassName("cart__order__form")[0];
  form.addEventListener("submit", async (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    for (element of document.querySelectorAll(
      ".cart__order__form__question input"
    )) {
      if (!dataCheck(element.id)) {
        alert("Form contain error");
        return;
      }
    }
    query = prepareQuery();
    response = await fetch("http://localhost:3000/api/products/order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: query,
    })
      .then((result) => {
        return result.json();
      })
      .catch((err) => {
        console.log(err);
        return nil;
      });
      console.log(response)
  });
  for (element of document.querySelectorAll(
    ".cart__order__form__question input"
  )) {
    element.addEventListener("change", function () {
      if (dataCheck(this.id)) {
        this.style.background = "#98FB98";
      } else {
        this.style.background = "#FAA0A0";
      }
    });
  }
}
