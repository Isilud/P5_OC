orderId = new URL(window.location.href).searchParams.get("order");
document.getElementById("orderId").innerText = orderId;
localStorage.removeItem("cart")