console.log("Hello");
const getItemsData = function () {
  let url = "http://localhost:3000/api/products";
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      return data;
    });
};

