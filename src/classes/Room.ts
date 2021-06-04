// Import classes
import Location from "./Location";
import Player from "./Player";
import Question from "./Question";

// Import rooms
import { G_rooms } from "../index";

// Import config
import * as config from "../config/constants";

interface RoomOptions {
	name: string;
	language: string;
	isPublic: boolean;
	host: Player;

	locations: Location[];

	spyCount: number;
}

export default class Room {
	public readonly id: string = generateRoomID();
	public name: string;
	public icon: string = getRandomIcon();
	public language: string;
	public isPublic: boolean;

	public isPlaying: boolean = false;

	public host: Player;
	public players: Map<string, Player> = new Map(); // Key: player.id

	public spyCount: number;
	public currentLocation?: string;

	public locations: Location[];
	public questions: Question[] = [];

	constructor(options: RoomOptions) {
		this.name = options.name;
		this.language = options.language;
		this.isPublic = options.isPublic;

		this.host = options.host;

		this.spyCount = options.spyCount;
		this.locations = options.locations;
	}
}

function getRandomIcon(): string {
	let keys: string[] = Array.from(config.avatarsMap.keys());
	let index: number = Math.floor(Math.random() * keys.length);
	return keys[index];
}
function generateRoomID(): string {
	let roomID: string = '';

	for (var i = 0; i < config.ROOM_ID_LENGTH; i++)
		roomID += config.ROOM_ID_CHARS.charAt(Math.floor(Math.random() * config.ROOM_ID_CHARS.length));

	let roomExists: boolean = checkForRoomID(roomID);

	if (roomExists)
		return generateRoomID();
	else
		return roomID;
}

function checkForRoomID(id: string): boolean {
	let exists: boolean = false;

	G_rooms.get(id, (err, room) => {
		if (err) checkForRoomID(id);
		if (room) exists = true;
		else exists = false;
	});

	return exists;
}
