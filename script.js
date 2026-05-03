// ================= REGISTER =================
document.getElementById("registerForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Prevent duplicate users
  if (users.find(u => u.username === username)) {
    alert("User already exists!");
    return;
  }

  const newUser = {
    username,
    password,
    balance: 100,
    funded: false,
    history: ["Registered with $100"]
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered successfully! You got $100 welcome balance.");
  window.location.href = "login.html";
});


// ================= LOGIN =================
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", username);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials");
  }
});


// ================= DASHBOARD =================
if (window.location.pathname.includes("dashboard.html")) {

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUsername = localStorage.getItem("currentUser");

  let user = users.find(u => u.username === currentUsername);

  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
  }

  function saveUser() {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function updateUI() {
    document.getElementById("balance").innerText = "Balance: $" + user.balance;
    updateHistory();
  }

  function updateHistory() {
    const historyList = document.getElementById("history");
    historyList.innerHTML = "";

    user.history.forEach(tx => {
      const li = document.createElement("li");
      li.textContent = tx;
      historyList.appendChild(li);
    });
  }

  updateUI();


  // ================= INVEST =================
  window.investNow = function () {
    alert("Investment started! (simulation)");

    // Simulate profit
    let profit = Math.floor(Math.random() * 50) + 10;
    user.balance += profit;

    user.history.push("Invested and earned $" + profit);
    saveUser();
    updateUI();
  };


  // ================= WITHDRAW =================
  window.withdraw = function () {

    if (!user.funded) {
      document.getElementById("depositModal").style.display = "block";
      return;
    }

    let amount = parseFloat(prompt("Enter withdrawal amount"));

    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    if (amount > user.balance) {
      alert("Insufficient balance");
      return;
    }

    user.balance -= amount;
    user.history.push("Withdrew $" + amount);

    saveUser();
    updateUI();

    alert("Withdrawal successful!");
  };


  // ================= FUND ACCOUNT =================
  window.fundAccount = function () {
    document.getElementById("depositModal").style.display = "block";
  };


  // ================= DEPOSIT =================
  window.showCryptoPrompt = function () {
    alert("Deposit successful (simulation)");

    user.balance += 50;
    user.funded = true;

    user.history.push("Deposited $50");
    saveUser();

    document.getElementById("depositModal").style.display = "none";
    updateUI();
  };


  window.closeModal = function () {
    document.getElementById("depositModal").style.display = "none";
  };


  // ================= CHART =================
  const ctx = document.getElementById("chart").getContext("2d");

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Start", "Now"],
      datasets: [{
        label: "Balance Trend",
        data: [100, user.balance],
        borderColor: "blue",
        fill: false
      }]
    }
  });
}