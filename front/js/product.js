window.onload = async function () {
  productID = new URL(window.location.href).searchParams.get("id");
  item = await fetchItem(productID);
  showItem(item);
};

async function fetchItem(id) {
  return await fetch("http://localhost:3000/api/products/" + id)
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
    })
    .then((result) => {
      return result;
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
