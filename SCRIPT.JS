let currentUser = null;

// 🔥 REGISTER
function register() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {

      db.collection("users").doc(userCred.user.uid).set({
        balance: 100
      });

      alert("Registered! You got $100 bonus");
      window.location.href = "login.html";
    })
    .catch(err => alert(err.message));
}

// 🔐 LOGIN
function login() {
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {

      localStorage.setItem("uid", userCred.user.uid);

      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}

// 📊 LOAD DASHBOARD
function loadDashboard() {
  let uid = localStorage.getItem("uid");

  if (!uid) {
    window.location.href = "login.html";
    return;
  }

  db.collection("users").doc(uid).get().then(doc => {
    document.getElementById("balance").innerText = doc.data().balance;
  });
}

// 💰 DEPOSIT
function deposit() {
  let uid = localStorage.getItem("uid");

  let amount = parseFloat(prompt("Deposit amount"));

  let ref = db.collection("users").doc(uid);

  ref.get().then(doc => {
    ref.update({
      balance: doc.data().balance + amount
    });

    loadDashboard();
  });
}

// 💸 WITHDRAW (IMPORTANT RULE)
function withdraw() {
  let uid = localStorage.getItem("uid");

  let ref = db.collection("users").doc(uid);

  ref.get().then(doc => {

    let balance = doc.data().balance;

    // 🚨 RULE
    if (balance <= 100) {
      alert("You must fund with at least $50 before withdrawal can take place");
      return;
    }

    let amount = parseFloat(prompt("Withdraw amount"));

    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    ref.update({
      balance: balance - amount
    });

    loadDashboard();
  });
}

// 🚪 LOGOUT
function logout() {
  auth.signOut();
  localStorage.removeItem("uid");
  window.location.href = "login.html";
}

// AUTO LOAD DASHBOARD
if (window.location.pathname.includes("dashboard")) {
  loadDashboard();
}