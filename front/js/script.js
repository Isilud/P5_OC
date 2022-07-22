window.onload = async function () {
  items = await fetchItemList();
  for (item of items) {
    show(item);
  }
};

async function fetchItemList() {
  return await fetch("http://localhost:3000/api/products")
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

function show(item) {
  const newItem = document.createElement("a");
  newItem.href = `./product.html?id=${item._id}`;
  newItem.innerHTML = `<article>
    <img src="${item.imageUrl}" alt="${item.altTxt}">
    <h3 class="productName">${item.name}</h3>
    <p class="productDescription">${item.description}</p>
  </article>`;
  let element = document.getElementById("items");
  element.appendChild(newItem);
}
