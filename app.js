// app.js
require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;
const { createClient } = require('redis');

const router = require('./router');
const startWebSocketServer = require('./websocket');

const app = express();

// -- MongoDB --
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

// -- Redis --
const redisClient = createClient({
    url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
    const app = express();

    const sessionMiddleware = session({
        key: 'sessionid',
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || 'supersecret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })

    app.use(sessionMiddleware);

    // -- Body Parsing --
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // -- Routes --
    app.use('/', router);

    // -- Start HTTP Server --
    const server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    });

    // -- Start WebSocket Server --
    startWebSocketServer(server, sessionMiddleware);
});