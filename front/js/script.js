import { request } from "./utils.js";

// Main

let items = await request("http://localhost:3000/api/products");
show(items);

// Inject all given items in the page
function show(items) {
  let element = document.getElementById("items");

  // For each given item
  for (let item of items) {
    // Create an element
    const newItem = document.createElement("a");
    newItem.href = `./product.html?id=${item._id}`;
    newItem.innerHTML = `<article>
    <img src="${item.imageUrl}" alt="${item.altTxt}">
    <h3 class="productName">${item.name}</h3>
    <p class="productDescription">${item.description}</p>
    </article>`;
    // Inject the element
    element.appendChild(newItem);
  }
}
