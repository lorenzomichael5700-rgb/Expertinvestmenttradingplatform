let currentUser = null;
let growthChart = null;

/* =======================
   SHOW SECTION
======================= */
function showSection(id) {
    document.querySelectorAll("section").forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");
    window.scrollTo(0, 0);
}

/* =======================
   BALANCE ANIMATION
======================= */
function animateBalance(element, start, end) {
    let duration = 600;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;

        let progress = Math.min((timestamp - startTime) / duration, 1);
        let value = Math.floor(progress * (end - start) + start);

        element.textContent = "$ " + value;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/* =======================
   REGISTER
======================= */
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!username || !password) {
        alert("Please fill all fields");
        return;
    }

    if (localStorage.getItem(username)) {
        alert("Username already exists!");
        return;
    }

    localStorage.setItem(username, password);
    localStorage.setItem(username + "_balance", 100);
    localStorage.setItem(username + "_deposits", JSON.stringify([]));
    localStorage.setItem(username + "_withdrawals", JSON.stringify([]));
    localStorage.setItem(
        username + "_growth",
        JSON.stringify([{ date: new Date().toLocaleDateString(), balance: 100 }])
    );

    alert("Registered successfully! You received $100 bonus.");
    showSection("login");
});

/* =======================
   LOGIN
======================= */
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
        currentUser = username;
        updateDashboard();
        showSection("dashboard");
    } else {
        alert("Invalid username or password");
    }
});

/* =======================
   DASHBOARD UPDATE
======================= */
function updateDashboard() {
    let balance = parseFloat(localStorage.getItem(currentUser + "_balance")) || 0;

    document.getElementById("userDisplay").textContent = currentUser;

    let balanceElement = document.getElementById("balanceDisplay");

    let currentDisplayed = parseFloat(balanceElement.textContent.replace("$", "")) || 0;

    animateBalance(balanceElement, currentDisplayed, balance);

    // Deposits
    let deposits = JSON.parse(localStorage.getItem(currentUser + "_deposits")) || [];
    let depositList = document.getElementById("depositHistory");
    depositList.innerHTML = "";

    deposits.forEach(d => {
        let li = document.createElement("li");
        li.textContent = `$${d.amount} - ${d.date}`;
        depositList.appendChild(li);
    });

    // Withdrawals
    let withdrawals = JSON.parse(localStorage.getItem(currentUser + "_withdrawals")) || [];
    let withdrawList = document.getElementById("withdrawHistory");
    withdrawList.innerHTML = "";

    withdrawals.forEach(w => {
        let li = document.createElement("li");
        li.textContent = `$${w.amount} - ${w.date}`;
        withdrawList.appendChild(li);
    });

    // Chart
    let growthData = JSON.parse(localStorage.getItem(currentUser + "_growth")) || [];
    renderChart(growthData);
}

/* =======================
   TOP UP
======================= */
function topUp() {
    let input = prompt("Enter deposit amount ($):");
    if (input === null) return;

    let amount = parseFloat(input);

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    let balance = parseFloat(localStorage.getItem(currentUser + "_balance")) || 0;
    balance += amount;

    localStorage.setItem(currentUser + "_balance", balance);

    let deposits = JSON.parse(localStorage.getItem(currentUser + "_deposits")) || [];
    deposits.push({ amount: amount, date: new Date().toLocaleString() });

    localStorage.setItem(currentUser + "_deposits", JSON.stringify(deposits));

    updateGrowth(balance);
    updateDashboard();

    alert("Deposited $" + amount);
}

/* =======================
   WITHDRAW
======================= */
function withdraw() {
    let balance = parseFloat(localStorage.getItem(currentUser + "_balance")) || 0;

    if (balance < 150) {
        alert("Withdrawal locked. Fund account first (min $150 balance).");
        return;
    }

    let input = prompt("Enter withdrawal amount ($):");
    if (input === null) return;

    let amount = parseFloat(input);

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    if (amount > balance) {
        alert("Insufficient balance");
        return;
    }

    balance -= amount;
    localStorage.setItem(currentUser + "_balance", balance);

    let withdrawals = JSON.parse(localStorage.getItem(currentUser + "_withdrawals")) || [];
    withdrawals.push({ amount: amount, date: new Date().toLocaleString() });

    localStorage.setItem(currentUser + "_withdrawals", JSON.stringify(withdrawals));

    updateGrowth(balance);
    updateDashboard();

    alert("Withdrawal successful: $" + amount);
}

/* =======================
   UPDATE GROWTH
======================= */
function updateGrowth(balance) {
    let data = JSON.parse(localStorage.getItem(currentUser + "_growth")) || [];

    data.push({
        date: new Date().toLocaleDateString(),
        balance: balance
    });

    localStorage.setItem(currentUser + "_growth", JSON.stringify(data));

    renderChart(data);
}

/* =======================
   CHART
======================= */
function renderChart(data) {
    let ctx = document.getElementById("growthChart").getContext("2d");

    let labels = data.map(d => d.date);
    let values = data.map(d => d.balance);

    if (growthChart) {
        growthChart.destroy();
    }

    growthChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Balance Growth",
                data: values,
                borderColor: "#0073e6",
                backgroundColor: "rgba(0,115,230,0.1)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/* =======================
   LOGOUT
======================= */
function logout() {
    currentUser = null;
    showSection("login");
}