// Main

fetchItemList();

// Functions Store

function fetchItemList() {
  fetch("http://localhost:3000/api/products")
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
    })
    .then((items) => {
      show(items);
    })
    .catch((err) => {
      console.log(err);
      return nil;
    });
};

function show(items) {
  for (item of items) {
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
}
