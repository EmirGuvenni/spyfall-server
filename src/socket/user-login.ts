// Import libraries
import {Socket} from "socket.io";

// Import classes
import User from "../classes/User";

// Import config
import {avatarsMap, MAX_USERNAME_LENGTH} from "../config/constants";
import {G_users} from "../index";

export default function SE_user_login(socket: Socket, username: string | any, avatar: string | any): void {
	// Validate username
	if (!username) {
		socket.emit('required-username');
		return;
	}
	else if (typeof username !== 'string') {
		socket.emit('invalid-username', 'The username must be a string.');
		return;
	}
	else if (username.length > MAX_USERNAME_LENGTH) {
		socket.emit('invalid-username', 'The username is too long.');
		return;
	}

	// Validate avatar
	if (!avatar) socket.emit('missing-avatar');
	else if (typeof avatar !== 'string') socket.emit('invalid-avatar', 'The avatar code must be a string.');
	else if (!avatarsMap.get(avatar)) socket.emit('invalid-avatar', 'The avatar code is not valid.');
	avatar = '';

	// Create a new user
	let user: User = new User({
		id: socket.id,
		username,
		avatar
	});
	G_users.set(user.id, user);
	socket.emit('success-login', user);
}

