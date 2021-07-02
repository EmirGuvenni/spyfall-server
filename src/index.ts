// Import libraries
import express from "express";
import http from "http";
import socketio from "socket.io";

// Import middlewares
import parser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import config
import * as config from "./config/constants";

// Initialization
const app = express();
const server = http.createServer(app);
export const io = new socketio.Server(server, { cors: { origin: config.WEBSITE_URL } });

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
import notFoundRoute from "./routes/404.route";

app.use('/rooms', roomsRoute);
app.use('/create', createRoute);
app.use('/feedback', feedbackRoute);
app.use('/room', roomIDRoute);
app.use('/*', notFoundRoute);

// Maps
import Room from "./classes/Room";
import User from "./classes/User";
import Player from "./classes/Player";

export const G_rooms: Map<string, Room> = new Map();
export const G_users: Map<string, User> = new Map();
export const G_players: Map<string, Player> = new Map();

// Socket.io
import socketHandler from "./socket";
io.on('connection', socketHandler);
