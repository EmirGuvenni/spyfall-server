// Import libraries
import express, { Request, Response } from "express";
import http from "http";
import socketio, { Socket } from "socket.io";
import redis, { RedisClient } from "redis";
import { createAdapter } from "socket.io-redis";

// Import middlewares
import parser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import config
import * as config from "./config/constants";
import Room from "./classes/Room";
import Player from "./classes/Player";
import Question from "./classes/Question";

// Initialization
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, { cors: { origin: config.WEBSITE_URL } });
const pubClient = redis.createClient({ host: process.env.REDIS_HOST });
const subClient = pubClient.duplicate();

const port = process.env.PORT || 3000;
const limiter = rateLimit({
	windowMs: config.RATE_LIMIT_TIME_MS,
	max: config.RATE_LIMIT,
})
server.listen(port, () => {
	console.log(`Listening to port: ${port}`);
});

// Middlewares
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(helmet());
app.use(limiter);

// Router
import roomsRoute from "./routes/rooms.route";
import createRoute from "./routes/create.route";
import roomIDRoute from "./routes/roomID.route";
import feedbackRoute from "./routes/feedback.route";

app.use('/rooms', roomsRoute);
app.use('/create', createRoute);
app.use('/feedback', feedbackRoute);
app.use('/room', roomIDRoute);

// Maps
export const G_rooms = redis.createClient({ host: process.env.REDIS_HOST });
export const G_players = redis.createClient({ host: process.env.REDIS_HOST });

// Socket.io
import socketHandler from "./socket";
io.on('connection', socketHandler);
