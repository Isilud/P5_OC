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
  for (product of cart["productList"]) {
    item = await fetchItem(product.id);
    injectData(item, product.color, product.quantity);
    totalPrice += item.price * product.quantity;
    totalQuantity += product.quantity;
  }
  injectTotal(totalPrice, totalQuantity);
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
  newItem.dataset["id"] = `${product.id}`;
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
