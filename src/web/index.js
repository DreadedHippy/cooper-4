import express from 'express';
import Redis from '../bot/core/setup/redis';
import socket from 'socket.io';
import cors from 'cors';
import Crossover from '../bot/core/setup/crossover';

const app = express();

// Put a hole in our own security, lulz.
const corsConfig = {
    "origin": "https://thecoop.group",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};
app.use(cors(corsConfig));


const server = app.listen(process.env.PORT);
console.log(`Listening on ${process.env.PORT}`);

const socketio = socket(server, { 
    cors: corsConfig,
    path: '/ws'
});

socketio.on('connection', (socket) => {
    console.log('a user connected');

    socket.emit('TEST', 'FUCK YOU ARMADO');
});


app.get('/', (req, res) => {
    res.send('Coop Web API');
});

app.get('/data/home', async (req, res) => {
    try {
        const hierarchyRedisResult = await Crossover.loadHiearchy();
        let hierarchy = {
            leaders: [],
            commander: JSON.parse(hierarchyRedisResult.commander)
        };
        console.log(hierarchyRedisResult.leaders);
        Object.keys(hierarchyRedisResult.leaders).map(leaderID => {
            hierarchy.leaders.push(JSON.parse(hierarchyRedisResult.leaders[leaderID]));
        });

        res.json({
            hierarchy
        });
    } catch(e) {
        console.log('Error loading home data:');
        console.error(e);
    }
});


Redis.connect();
Redis.connection.on('connection', () => {
    console.log('Redis ready');

    // let lastRedisUpdate;
    // setInterval(() => {
    //     // Use certain redis values as a queue to update websockets connected to the coop.
    // }, 60 * 1 * 1000);

});
