const mongoose = require("mongoose");

const GameRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    gameId: String,
    winner: String,
    moves: Array,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GameRecord", GameRecordSchema);
