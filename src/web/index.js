import express from 'express';
import Redis from '../bot/core/setup/redis';
import socket from 'socket.io';
import cors from 'cors';

const app = express();

// Put a hole in our own security, lulz.
const corsConfig = {
    "origin": "https://thecoop.group",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};
app.use(cors(corsConfig));

Redis.connect();
Redis.connection.on('ready', () => {
    console.log('Redis ready');

    app.get('/', (req, res) => {
        res.send('Coop Web API');
    });

    app.post('job', (req, res) => {
        // Post job into server from website.
    });
    
    const server = app.listen(process.env.PORT);
    const socketio = socket(server, { cors: corsConfig });

    let lastRedisUpdate;
    setInterval(() => {
        // Use certain redis values as a queue to update websockets connected to the coop.
    }, 60 * 1 * 1000);

    socketio.on('connection', (socket) => {
        console.log('a user connected');

        socket.emit('TEST', 'FUCK YOU ARMADO');
    });

    console.log(`Listening on ${process.env.PORT}`);
});
