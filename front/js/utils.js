export async function request(url) {
  fetch(url)
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
    })
    .catch((err) => {
      console.log(err);
      return nil;
    });
}
