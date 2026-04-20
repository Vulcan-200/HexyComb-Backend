// client.js

const handleError = (message) => {
    const errBox = document.getElementById('errorBox');
    const errMsg = document.getElementById('errorMessage');

    if (errBox && errMsg){
        msg.textContent = message;
        box.classList.remove('hidden');
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
    if (box) {
        box.classList.add('hidden');
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

            const username = loginForm.querySelector('#user').value;
            const pass = loginForm.querySelector('#pass').value;

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

            const username = signupForm.querySelector('#user').value;
            const pass = signupForm.querySelector('#pass').value;
            const pass2 = signupForm.querySelector('#pass2').value;

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
};