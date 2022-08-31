import { fetchCart, request, setCart } from "./utils.js";

main();

// Récupére les informations du produit et met en place les action à effectuer lors de l'ajout dans le panier.
async function main() {
  let productID = new URL(window.location.href).searchParams.get("id");
  let item = await request("http://localhost:3000/api/products/" + productID);
  showItem(item);

  document.getElementById(`addToCart`).addEventListener(`click`, function () {
    let color = document.getElementById(`colors`).value;
    let quantity = document.getElementById(`quantity`).value;
    quantity = parseInt(quantity);
    let isAdded = addToCart(productID, color, quantity);
    if (isAdded) {
      alert("L'article a été ajouté au panier.");
      window.location.href = "./cart.html";
    }
  });
}

// Affiche les données de l'objet passé en paramètre.
function showItem(item) {
  let item__img = document.querySelector(`.item__img`);
  item__img.innerHTML = `<img src="${item.imageUrl}" alt="${item.altTxt}"></img>`;

  let title = document.getElementById("title");
  title.innerText = `${item.name}`;

  let price = document.getElementById("price");
  price.innerText = `${item.price}`;

  let description = document.getElementById("description");
  description.innerText = `${item.description}`;

  let colors = document.getElementById("colors");
  for (let color of item.colors) {
    let newColor = document.createElement("option");
    newColor.innerText = color;
    newColor.value = color;
    colors.appendChild(newColor);
  }
}

// Met a jour le panier avec les informations demandées.
function addToCart(productID, color, quantity) {
  if (quantity == 0 || quantity < 1 || quantity > 100) {
    alert("Veuillez entrer un nombre entre 0 et 100");
    return false;
  }
  if (color == "") {
    alert("Veuillez choisir une couleur.");
    return false;
  }
  // On définit le produit en cours et on récupére le panier présent
  let newProduct = { id: productID, color: color, quantity: quantity };
  let productList = fetchCart();

  // On ajoute notre produit
  let productIndex = productList.findIndex(
    (product) =>
      product.id == newProduct.id && product.color == newProduct.color
  );
  if (productIndex == -1) {
    productList.push(newProduct);
  } else {
    productList[productIndex].quantity += newProduct.quantity;
  }

  // On met à jour notre panier dans le storage.
  setCart(productList);
  return true;
}
