// Main
productID = new URL(window.location.href).searchParams.get("id");
fetchItem(productID);

document.getElementById(`addToCart`).addEventListener(`click`, function () {
  let color = document.getElementById(`colors`).value;
  let quantity = document.getElementById(`quantity`).value;
  quantity = parseInt(quantity);
  isAdded = addToCart(productID, color, quantity);
  if (isAdded) {
    alert("L'article a été ajoutéau panier.")
    window.location.href = "./cart.html";
  }
});

// Functions Store

function fetchItem(id) {
  fetch("http://localhost:3000/api/products/" + id)
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
    })
    .then((result) => {
      showItem(result);
    })
    .catch((err) => {
      console.log(err);
      return nil;
    });
}

function showItem(item) {
  item__img = document.querySelector(`.item__img`);
  item__img.innerHTML = `<img src="${item.imageUrl}" alt="${item.altTxt}"></img>`;

  title = document.getElementById("title");
  title.innerText = `${item.name}`;

  price = document.getElementById("price");
  price.innerText = `${item.price}`;

  description = document.getElementById("description");
  description.innerText = `${item.description}`;

  colors = document.getElementById("colors");
  for (color of item.colors) {
    newColor = document.createElement("option");
    newColor.innerText = color;
    newColor.value = color;
    colors.appendChild(newColor);
  }
}

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
  newProduct = { id: productID, color: color, quantity: quantity };
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
