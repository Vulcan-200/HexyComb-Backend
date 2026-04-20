// Match.js Model
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    gameId: 
    { 
        type: String, 
        required: true,
    },
    players: 
    [{ 
        type: String,
        ref: 'Account',
    }],
    status: 
    { 
        type: String, 
        default: 'waiting',
    },
    createdDate:
    {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Match', MatchSchema);