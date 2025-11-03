document.addEventListener("DOMContentLoaded", () => {
  const coins = [
    { id: "bitcoin", priceId: "btc-price" },
    { id: "ethereum", priceId: "eth-price" },
    { id: "solana", priceId: "sol-price" }
  ];

  const updateBtn = document.getElementById("update-all");
  const timerDisplay = document.getElementById("timer");
  let cooldown = false;
  let countdown = null;

  function fetchPrices() {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=eur";

    fetch(url)
      .then(response => response.json())
      .then(data => {
        coins.forEach(coin => {
          const price = data[coin.id].eur;
          document.getElementById(coin.priceId).textContent = `${price.toLocaleString()} €`;
        });
      })
      .catch(error => {
        console.error("Virhe haussa:", error);
        coins.forEach(coin => {
          document.getElementById(coin.priceId).textContent = "Virhe";
        });
      });
  }

  function startCooldown(seconds) {
    cooldown = true;
    updateBtn.disabled = true;
    updateBtn.classList.add("cooldown");
    updateBtn.textContent = "COOLDOWN";

    let timeLeft = seconds;
    timerDisplay.textContent = `${timeLeft}s`;

    countdown = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        timerDisplay.textContent = "";
        cooldown = false;
        updateBtn.disabled = false;
        updateBtn.classList.remove("cooldown");
        updateBtn.textContent = "Päivitä hinnat";
      }
    }, 1000);
  }

  updateBtn.addEventListener("click", () => {
    if (!cooldown) {
      fetchPrices();
      startCooldown(60); // 60 sekunnin cooldown
    }
  });
});
