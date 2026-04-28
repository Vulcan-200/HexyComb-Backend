// client.js

console.log("client.js loaded");

const handleError = (message) => {
    const errBox = document.getElementById('errorBox');
    const errMsg = document.getElementById('errorMessage');

    if (errBox && errMsg){
        errMsg.textContent = message;
        errBox.classList.remove('hidden');
    }
};

const sendPost = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    const errBox = document.getElementById('errorBox');
    if (errBox) {
        errBox.classList.add('hidden');
    }

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }
};

window.onload = () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = loginForm.querySelector('input[name="username"]').value;
            const pass = loginForm.querySelector('input[name="pass"]').value;

            if (!username || !pass) {
                handleError('All fields are required!');
                return;
            }

            sendPost('/login', { username, pass });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = signupForm.querySelector('input[name="username"]').value;
            const pass = signupForm.querySelector('input[name="pass"]').value;
            const pass2 = signupForm.querySelector('input[name="pass2"]').value;

            if (!username || !pass || !pass2) {
                handleError('All fields are required!');
                return;
            }

            if (pass !== pass2) {
                handleError('Passwords do not match!');
                return;
            }

            sendPost('/signup', { username, pass, pass2 });
        });
    }

    const continueFree = document.getElementById("continue-free");
    const upgradePremium = document.getElementById("upgrade-premium");
    const cancelPremium = document.getElementById("cancel-premium");

    if (continueFree)
    {
        continueFree.addEventListener("click", () => {
            window.location.href = "/play";
        });
    }

    if (upgradePremium)
    {
        upgradePremium.addEventListener("click", async ()=> {
            const res = await fetch("/premium/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (data.premium)
            {
                window.location.reload();
            }
        });
    }

    if (cancelPremium)
    {
        cancelPremium.addEventListener("click", async () => {
            const res = await fetch("/premium/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (!data.premium)
            {
                window.location.reload();
            }
        });
    }
};