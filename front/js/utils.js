// Retourne une promesse devant contenir les données demandées.
export async function request(url) {
  return fetch(url)
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return nil;
    });
}

// Récupére le contenu du panier depuis le localStorage
export function fetchCart() {
  if (localStorage.getItem("cart") == null) {
    return [];
  }
  return JSON.parse(localStorage.getItem("cart"))["productList"];
}

// Enregistrele contenu du panier dans le localStorage
export function setCart(productList) {
  if (productList.length != 0) {
    let cart = { productList: productList };
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}
