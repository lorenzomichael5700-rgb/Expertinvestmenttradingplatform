let isLogin = true;

const form = document.getElementById("auth-form");
const title = document.getElementById("title");
const toggle = document.getElementById("toggle");
const toggleText = document.getElementById("toggle-text");

toggle.onclick = () => {
    isLogin = !isLogin;

    title.innerText = isLogin ? "Login" : "Register";

    toggleText.innerHTML = isLogin
        ? `Don't have account? <span id="toggle">Register</span>`
        : `Already have account? <span id="toggle">Login</span>`;

    location.reload(); // quick fix to rebind toggle
};

form.onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Fill all fields");
        return;
    }

    if (isLogin) {
        const user = JSON.parse(localStorage.getItem(username));

        if (user && user.password === password) {
            localStorage.setItem("loggedIn", username);
            window.location.href = "dashboard.html";
        } else {
            alert("Wrong login details");
        }

    } else {
        if (localStorage.getItem(username)) {
            alert("User already exists");
            return;
        }

        localStorage.setItem(username, JSON.stringify({
            password: password,
            balance: 100,
            verified: false,
            transactions: []
        }));

        alert("Registration successful! Please login.");

        // switch back to login
        isLogin = true;
        title.innerText = "Login";
        form.reset();
    }
};