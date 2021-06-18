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
io.adapter(createAdapter({ pubClient, subClient }));

io.on('connection', (socket: Socket) => {
	console.log(`${socket.id} joined`);

	// A player joins to a room
	socket.on('player_join', async (roomID: string, username: string) => {
		await socket.join(roomID);

		// Check if the player was present in the room
		// before this connection
		G_rooms.get(roomID, (err, roomJSON) => {
			if (err) {
				return;
			}

			// If room doesn't exists, respond with 404
			if (!roomJSON) {
				io.emit('invalid_room');
				return;
			}

			let room: Room = JSON.parse(roomJSON);
			let player: Player = new Player({
				id: socket.id,
				username: username,

				roomID: roomID,

				role: 'Spectator',
				isSpy: false
			});

			if (room.players.get(socket.id)) {
				io.emit('player_join', socket.id);
			}
		});
	});

	// A player leaves the room
	socket.on('player_leave', (roomID: string) => {
		socket.leave(roomID);

		// Remove the player from the room
		G_rooms.get(roomID, (err, roomJSON) => {
			if (err) {
				return;
			}

			let room: Room = JSON.parse(roomJSON!);
			room.players.delete(socket.id);
		});

		io.emit('player_left', socket.id);
	});

	// A player ask a question to another player
	socket.on('player_ask', (question: Question) => {
		G_rooms.get(question.roomID, (err, roomJSON) => {
			let room: Room = JSON.parse(roomJSON!);

			room.questions.push(question);

			const questionPayload = {
				from: room.players.get(question.fromID),
				to: room.players.get(question.toID),
				content: question.content,
				askedAt: question.askedAt
			};

			socket.emit('new_question', questionPayload);
		})
	});

	// A player answers a question
	socket.on('player_answer', (roomID: string, questionID: string, answer: string) => {
		G_rooms.get(roomID, (err, room) => {

		});
	})
});