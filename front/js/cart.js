// Main

import { fetchCart, request, setCart } from "./utils.js";

async function Main() {
  // Affiche les articles
  showPage();
  // Met en place le formulaire
  setForm();
}

Main();

// Functions store

// Met à jour la page en utilisant les données du localStorage
async function showPage() {
  // Affiche chaque produit présent dans le panier
  for (let product of fetchCart()) {
    let item = await request(
      "http://localhost:3000/api/products/" + product.id
    );
    injectData(item, product.color, product.quantity);
  }

  //On met à jour le montant total du panier
  updateTotal();

  // Pour chaque produit, ajoute l'événement de suppression
  for (let element of document.getElementsByClassName("deleteItem")) {
    element.addEventListener("click", function (event) {
      deleteItem(event);
      updateTotal();
    });
  }

  // Pour chaque produit, ajoute l'événement de modification
  for (let element of document.getElementsByClassName("itemQuantity")) {
    element.addEventListener("change", function (event) {
      changeQuantity(event);
      updateTotal();
    });
  }
}

// Injecte un produit correspondant aux paramètres sur la page
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

// Met à jour le prix et la quantité totale 
async function updateTotal() {
  var totalQuantity = 0;
  var totalPrice = 0;
  for (let element of document.getElementsByClassName("cart__item")) {
    let quantity = parseInt(element.getElementsByClassName("itemQuantity")[0].value);
    let item = await request(
      "http://localhost:3000/api/products/" + element.dataset["id"]
    );
    totalQuantity += quantity;
    totalPrice += parseInt(item.price) * quantity;
  }
  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;
}

// Supprime un objet du panier et de la page
function deleteItem(event) {
  let element = event.target;
  let id = element.closest(".cart__item").dataset.id;
  let color = element.closest(".cart__item").dataset.color;
  let productList = fetchCart();
  let newList = productList.filter(function (item) {
    return item.id != id || item.color != color;
  });
  element.closest(".cart__item").remove();
  setCart(newList);
  if (newList.length == 0) {
    alert("Le panier est vide, retour à l'accueil.");
    window.location.href = "./index.html";
    localStorage.removeItem("cart");
  }
}

// Change la quantité d'un objet du panier
function changeQuantity(event) {
  let element = event.target;
  let id = element.closest(".cart__item").dataset.id;
  let color = element.closest(".cart__item").dataset.color;
  let quantity = event.target.value;
  if (quantity >= 1 && quantity <= 100) {
    let productList = fetchCart();
    let index = productList.findIndex((el) => {
      return el.id == id && el.color == color;
    });
    productList[index].quantity = quantity;
    setCart(productList);
  } else {
    alert("Veuillez entrer un nombre entre 0 et 100");
  }
}

// Vérifie les données entrées par l'utilisateur
function dataCheck(id) {
  switch (id) {
    case "firstName":
    case "lastName":
      return /^([A-Z]|[ÉÈÇÀÙ]){1}([a-z]|[éèçàù])*(-?([A-Z]|[ÉÈÇÀÙ]){1}([a-z]|[éèçàù])*)*$/.test(
        document.getElementById(id).value
      );
    case "address":
      return /^[0-9]{1,}((\s|-){1}([A-Z]|[ÉÈÇÀÙ]|[a-z]|[éèçàù]|[0-9]){1,}){1,}$/.test(
        document.getElementById(id).value
      );
    case "city":
      return /^([A-Z]|[ÉÈÇÀÙ])+([a-z]|[éèçàù])*((-\s)?([A-Z]|[ÉÈÇÀÙ])*([a-z]|[éèçàù])*)*$/.test(
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

// Met en forme la requête qui doit être envoyée
function prepareQuery() {
  let query = {
    contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    },
    products: [],
  };
  for (let product of fetchCart()) {
    query["products"].push(product.id);
  }
  return JSON.stringify(query);
}

// Met en place le formulaire
function setForm() {
  let form = document.getElementsByClassName("cart__order__form")[0];

  // Met en place l'action à lancer lors du clic de l'utilisateur
  form.addEventListener("submit", async (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    // On vérifie que le panier n'est pas vide
    if (fetchCart().length == 0) {
      alert("Aucun article dans le panier.");
      return;
    }
    // On vérifie la validité des données
    for (let element of document.querySelectorAll(
      ".cart__order__form__question input"
    )) {
      if (!dataCheck(element.id)) {
        alert(
          "Le formulaire contient des erreurs, veuillez vérifier vos informations."
        );
        return;
      }
    }
    // Onprépare la requête et on l'envoie
    let query = prepareQuery();
    let response = await fetch("http://localhost:3000/api/products/order/", {
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
    window.location.href = `./confirmation.html?order=${response.orderId}`;
  });

  // Ajoute un background pour indiquer à l'utilisateur la validité des données
  for (let element of document.querySelectorAll(
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
