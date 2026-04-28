// Account.js Controller
const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const signupPage = (req, res) => {
    return res.render('signup');
};

const profilePage = (req, res) => {
    const created = new Date(req.session.account.createdDate).toLocaleDateString(
        'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return res.render('profile', {
        account: req.session.account,
        createdDate: created,
    });
};

// Login
const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' }); 
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/play' });
    });
};

// Logout
const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}

// Signup
const signup = async (req, res) => {
    const nickname = `${req.body.nickname}` || '';
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass != pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass);

        const newAccount = new Account({
            nickname,
            username,
            password: hash,
            premium: false,
        });

        await newAccount.save();

        req.session.account = Account.toAPI(newAccount);

        return res.json({ redirect: '/play' });
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: 'An error occured!' });
    }
};

// Change account info
const changeNickname = async (req, res) => {
    const { nickname } = req.body;

    if (!nickname || nickname.trim().length === 0) {
        return res.status(400).json({ error: "Nickname cannot be empty."});
    }

    try {
        const account = await Account.findById(req.session.account._id);
        if (!account) {
            return res.status(401).json({ error: "Not logged in!" });
        }

        account.nickname = nickname;
        await account.save();

        req.session.account.nickname = nickname;

        return res.json({ success: true, nickname });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating nickname." });
    }
};

const changeUsername = async (req, res) => {
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: "Username cannot be empty."});
    }

    try {
        const account = await Account.findById(req.session.account._id);
        if (!account) {
            return res.status(401).json({ error: "Not logged in!" });
        }

        account.username = username;
        await account.save();

        req.session.account.username = username;

        return res.json({ success: true, username });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error updating username." });
    }
};

const changePassword = async (req, res) => {
    const { oldPass, newPass, newPass2 } = req.body;

    if (!oldPass || !newPass || !newPass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (newPass !== newPass2) {
        return res.status(400).json({ error: 'New passwords do not match!' });
    }

    const account = await Account.findById(req.session.account._id);
    if (!account) {
        return res.status(401).json({ error: "Not logged in!"});
    }

    const match = await Account.authenticate(account.username, oldPass, () => {});
    if (!match) {
        return res.status(401).json({ error: 'Old password incorrect! '});
    }

    const newHash = await Account.generateHash(newPass);
    account.password = newHash;
    await account.save();

    return res.json({ message: 'Password updated successfully!' });
};

const togglePremium = async (req, res) => {
    const account = await Account.findById(req.session.account._id);
    account.premium = !account.premium;
    await account.save();

    // Update session
    req.session.account.premium = account.premium;

    return res.json({ premium: account.premium });
};

module.exports = {
    loginPage,
    signupPage,
    profilePage,
    login,
    logout,
    signup,
    changeNickname,
    changeUsername,
    changePassword,
    togglePremium,
}