// Match.js Controller
const crypto = require('crypto');
const Match = require('../models/Match');

const createInviteMatch = async (req, res) => {
    try {
        const gameId = crypto.randomUUID();

        const match = await Match.create({
            gameId,
            players: [req.session.account._id],
            status: 'waiting',
        });

        res.json({ gameId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create invite match. '});
    }
};

const getInviteMatch = async (req, res) => {
    try {
        const { gameId } = req.params;

        const match = await Match.findOne({ gameId });

        if (!match) {
            return res.status(404).json({ error: 'Match not found.' });
        }

        const userId = req.session.account._id;

        if (!match.players.includes(userId)) {
            match.players.push(userId);

            if (match.players.length === 2) {
                match.status = 'active';
            }

            await match.save();
        }

        return res.json({
            gameId: match.gameId,
            players:match.players,
            status: match.status,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to join match.' });
    }    
};

module.exports = {
    createInviteMatch,
    getInviteMatch,
}