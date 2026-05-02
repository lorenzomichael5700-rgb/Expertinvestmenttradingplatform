Js
const user = localStorage.getItem("loggedIn");

if (!user) window.location.href = "index.html";

let data = JSON.parse(localStorage.getItem(user));

document.getElementById("user").innerText = user;

function save() {
    localStorage.setItem(user, JSON.stringify(data));
}

function update() {
    document.getElementById("balance").innerText = data.balance;

    const history = document.getElementById("history");
    history.innerHTML = "";

    data.transactions.forEach(t => {
        history.innerHTML += `
            <tr>
                <td>${t.type}</td>
                <td>$${t.amount}</td>
            </tr>
        `;
    });
}

document.getElementById("verify").onclick = () => {
    data.verified = true;
    save();
    alert("Account verified!");
};

document.getElementById("deposit-form").onsubmit = (e) => {
    e.preventDefault();

    let amt = Number(document.getElementById("deposit").value);

    data.balance += amt;

    data.transactions.unshift({
        type: "Deposit",
        amount: amt
    });

    save();
    update();
};

document.getElementById("withdraw-form").onsubmit = (e) => {
    e.preventDefault();

    if (!data.verified) {
        alert("Found your account first before withdraw can take place.");
        return;
    }

    let amt = Number(document.getElementById("withdraw").value);

    if (amt > data.balance) return alert("Low balance");

    data.balance -= amt;

    data.transactions.unshift({
        type: "Withdraw",
        amount: amt
    });

    save();
    update();
};

document.getElementById("logout").onclick = () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
};

update();
document.getElementById("user").innerText = user;