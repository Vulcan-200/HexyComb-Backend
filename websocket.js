// websocket.js
const { WebSocketServer } = require('ws');
const crypto = require('crypto');
const { connect } = require('http2');

let connectedPlayers = new Set();
let randomQueue = [];

function startWebSocketServer(server, sessionMiddleware)
{
    const wss = new WebSocketServer({ noServer: true});

    // HTTP to WebSocket upgrade
    server.on('upgrade', (req, socket, head) => {
        if (req.url === "/ws") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        } else {
            socket.destroy();
        }
    });

    // WebSocket connection event
    wss.on('connection', (ws) => {
        connectedPlayers.add(ws);
        broadcastPlayersCount();
    
        ws.on('message', (msg) =>
        {
            const data = JSON.parse(msg);

            switch (data.type)
            {
                case 'join_random_queue':
                    handleRandomQueue(ws, data.playerId);
                    break;

                case 'move':
                    forwardMove(ws, data);
                    break;
            }
        });

        ws.on('close', () => {
            connectedPlayers.delete(ws);
            broadcastPlayersCount();
        });
    });


    function broadcastPlayersCount()
    {
        const count = connectedPlayers.size;
        const msg = JSON.stringify({ type: 'playercount', count });

        connectedPlayers.forEach((ws) => {
            if (ws.readyState === ws.OPEN){
                ws.send(msg);
            }
                
        });
    }

    function handleRandomQueue(ws, playerId)
    {
        if (randomQueue.length === 0)
        {
            randomQueue.push({ ws, playerId });
            return;
        }

        const opponent = randomQueue.shift();
        const gameId = crypto.randomUUID();

        const white = Math.random() < 0.5 ? ws: opponent.ws;
        const black = white === ws ? opponent.ws : ws;

        white.send(JSON.stringify({
            type: 'match_found',
            gameId,
            playerColor: 'white',
        }));

        black.send(JSON.stringify({
            type: 'match_found',
            gameId,
            playerColor: 'black',
        }));
    }

    function forwardMove(ws, data)
    {
        connectedPlayers.forEach((client) =>
        {
            if (client !== ws)
            {
                client.send(JSON.stringify({
                    type: 'opponent_move',
                    payload: data.payload,
                }));
            }
        });
    }
}

module.exports = startWebSocketServer;