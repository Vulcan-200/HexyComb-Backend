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

// --- Unity Brotli URL Rewriting ---
app.use((req, res, next) => {
    if (req.url.startsWith('/Build/') && req.url.endsWith('.wasm')) {
        req.url += '.br';
    }
    if (req.url.startsWith('/Build/') && req.url.endsWith('.js')) {
        req.url += '.br';
    }
    if (req.url.startsWith('/Build/') && req.url.endsWith('.data')) {
        req.url += '.br';
    }
    next();
});

// --- Unity Brotli Support ---
app.use((req, res, next) => {
    if (req.url.startsWith('/Build/') && req.url.endsWith('.wasm.br')) {
        res.setHeader('Content-Type', 'application/wasm');
        res.setHeader('Content-Encoding', 'br');
    }
    if (req.url.startsWith('/Build/') && req.url.endsWith('.js.br')) {
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Content-Encoding', 'br');
    }
    if (req.url.startsWith('/Build/') && req.url.endsWith('.data.br')) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Encoding', 'br');
    }
    next();
});

app.use(express.static(path.join(__dirname, 'hosted')));

// -- Handlebars --
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

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