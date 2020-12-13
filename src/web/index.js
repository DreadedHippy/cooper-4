import express from 'express';
import Redis from '../bot/core/setup/redis';
import socket from 'socket.io';

const app = express();

Redis.connect();
Redis.connection.on('ready', () => {
    console.log('Redis ready');

    app.get('/', (req, res) => {
        res.send('Coop Web API');
    });
    
    const server = app.listen(process.env.PORT);
    const socketio = socket.listen(server);

    socketio.on('connection', (socket) => {
        console.log('a user connected');

        socket.emit('TEST', 'FUCK YOU ARMADO');
    });

    console.log(`Listening on ${process.env.PORT}`);
});
