const GameRecord = require('../models/GameRecord');

const saveGame = async (req, res) => {
    const { gameId, winner, moves } = req.body;

    try {
        const record = new GameRecord({
            userId: req.session.account._id,
            gameId,
            winner,
            moves
        });

        await record.save();

        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to save game" });
    }
};

module.exports = { saveGame };
