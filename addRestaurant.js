
// when page loads
document.addEventListener("DOMContentLoaded", () => {
  // when save button is clicked, send post request with new info
  document.getElementById("save").addEventListener("click", async () => {
    let nameRes = document.getElementById("name").value;
    let minOrder = document.getElementById("minOrder").value;
    let deliveryFee = document.getElementById("deliveryFee").value;

    let response = await fetch("/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameRes,
        delivery_fee: parseFloat(deliveryFee),
        min_order: parseFloat(minOrder),
      }),
    });

    if (!response.ok) {
      alert("failed");
    } else {
      // upon successful response, go to new restaurant page
      alert("Changes successfully made.");
      let res = await response.json();
      window.location.href = "/restaurants/" + res.id;
    }
  });
});
