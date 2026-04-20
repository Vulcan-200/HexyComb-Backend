// router.js
const express = require('express');
const router = express.Router();

const controllers = require('./src/controllers');
const Account = controllers.Account;
const Match = controllers.Match;
const mid = require('./middleware');

// -- Account Routes --
router.get('/login', mid.requiresSecure, mid.requiresLogout, Account.loginPage);
router.post('/login', mid.requiresSecure, mid.requiresLogout, Account.login);
router.get('/signup', mid.requiresSecure, mid.requiresLogout, Account.signupPage);
router.post('/signup', mid.requiresSecure, mid.requiresLogout, Account.signup);
router.get('/logout', mid.requiresSecure, mid.requiresLogin, Account.logout);
router.get('/changePassword', mid.requiresSecure, mid.requiresLogout, Account.changePassword);

// -- Profit Model --
router.post('/premium/toggle', mid.requiresLogin, Account.changePassword);

// -- Matchmaking Routes --
router.post('/invite/create', mid.requiresLogin, Match.createInviteMatch);
router.get('/invite/:gameId', mid.requiresLogin, Match.getInviteMatch);

// -- Player Count --
router.get('/playerCount', (req, res) => {
    res.json({ count: global.connectedPlayersCount || 0 });
});

// -- Root --
router.get('/', mid.requiresSecure, mid.requiresLogout, Account.loginPage);

router.get('/play', (req, res) => {
    res.sendFile(path.join(__dirname, '../hosted/index.html'));
});

// -- 404 --
router.get('/*wild', (req, res) => {
    res.status(404).render('404');
});

module.exports = router;