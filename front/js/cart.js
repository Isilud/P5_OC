for (product of localStorage.getItem("cart")["productList"]) {
  const newItem = document.createElement("article");
  newItem.className = "cart__item";
  newItem.dataset["data-id"] = `${product - ID}`;
  newItem.dataset["data-color"] = `${product - color}`;
  newItem.href = `./product.html?id=${item._id}`;
  newItem.innerHTML = `
  <div class="cart__item__img">
    <img src="../images/product01.jpg" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>Nom du produit</h2>
      <p>Vert</p>
      <p>42,00 €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
       <p>Qté : </p>
       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>`;
  let element = document.getElementById("items");
  element.appendChild(newItem);
}
