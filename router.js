// router.js
const path = require('path');
const express = require('express');
const router = express.Router();

const controllers = require('./src/controllers');
const GameRecord = require('./src/models/GameRecord');
const Account = controllers.Account;
const Match = controllers.Match;
const Game = controllers.Game;
const mid = require('./middleware');

// -- Account Routes --
router.get('/login', mid.requiresSecure, mid.requiresLogout, Account.loginPage);
router.post('/login', mid.requiresSecure, mid.requiresLogout, Account.login);
router.get('/signup', mid.requiresSecure, mid.requiresLogout, Account.signupPage);
router.post('/signup', mid.requiresSecure, mid.requiresLogout, Account.signup);
router.get('/logout', mid.requiresSecure, mid.requiresLogin, Account.logout);
router.get('/profile', mid.requiresSecure, mid.requiresLogin, Account.profilePage);

router.post('/account/nickname', mid.requiresLogin, Account.changeNickname);
router.post('/account/username', mid.requiresLogin, Account.changeUsername);
router.post('/account/password', mid.requiresLogin, Account.changePassword);

// -- Premium Check --
router.get('/account/status', mid.requiresLogin, (req, res) => {
    const isPremium = req.session.account.premium;
    res.json({ 
        premium: isPremium,
        allowedOnline: isPremium,
    });
});

// -- Matchmaking Routes --
router.post('/invite/create', mid.requiresLogin, Match.createInviteMatch);
router.get('/invite/:gameId', mid.requiresLogin, Match.getInviteMatch);

// -- Player Count --
router.get('/playerCount', (req, res) => {
    res.json({ count: global.connectedPlayersCount || 0 });
});

// -- Root --
router.get('/', mid.requiresSecure, mid.requiresLogout, Account.loginPage);

// -- Game --
router.get('/play', (req, res) => {
    res.render('play');
});

router.post("/games/save", async (req, res) => {
    const { gameId, winner, moves } = req.body;

    const record = new GameRecord({
        userId: req.session.account._id,
        gameId,
        winner,
        moves,
        createdAt: new Date()
    });

    await record.save();

    res.json({ success: true });
});

// -- Documentation --
router.get('/documentation', (req, res) => {
    res.render('documentation');
});

// -- Premium --
router.get('/premium', mid.requiresSecure, mid.requiresLogin, (req, res) => {
    console.log("SESSION:", req.session.account);
    res.render('premium', {premium: req.session.account.premium});
});

// -- Premium Toggle --
router.post('/premium/toggle', mid.requiresLogin, Account.togglePremium);

// -- 404 --
router.get('/*wild', (req, res) => {
    res.status(404).render('404');
});

module.exports = router;