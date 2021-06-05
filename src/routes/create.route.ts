// Import libraries
import { Router, Request, Response } from "express";

// Inıtialize a router
const router: Router = Router();

// Import classes
import Location from "../classes/Location";
import Room from "../classes/Room";
import Player from "../classes/Player";

// Import Maps
import { G_players, G_rooms } from "../index";
import {
	MAX_ROOM_NAME_LENGTH,
	LANGUAGES,
	MAX_SPY_LIMIT,
	MAX_LOCATION_LIMIT,
	MIN_LOCATION_LIMIT,
	MAX_TIMER_LIMIT,
	MIN_TIMER_LIMIT
} from "../config/constants";
import Timer from "../classes/Timer";

router.route('/')
	.post(postRouteHandler)

interface PlayerRequestParameters {
	id: string;
	username: string;
	avatar: string;
}

function postRouteHandler(req: Request, res: Response): void {
	let name: string = req.body.name;
	let language: string = req.body.language;
	let isPublic: boolean = req.body.isPublic;

	let host: Player = req.body.host;
	let players: PlayerRequestParameters[] = req.body.players;

	let spyCount: number = req.body.spyCount;
	let locations: Location[] = req.body.locations;
	let duration: number = req.body.duration;

	let rejections: string[] = [];
	/**
	 * Validate the room parameters
	 */

	// Validate room name
	if (!name) rejections.push('no_name');
	else if (name.length > MAX_ROOM_NAME_LENGTH) rejections.push('long_name');

	// Validate language
	if (!language) rejections.push('no_language');
	else if (!LANGUAGES.includes(language)) rejections.push('invalid_language');

	// Validate spy count
	if (!spyCount) spyCount = 1;
	else if (spyCount > MAX_SPY_LIMIT) spyCount = MAX_SPY_LIMIT;

	// Validate locations
	if (!locations) rejections.push('no_locations');
	else if (locations.length > MAX_LOCATION_LIMIT) locations = locations.slice(0, MAX_LOCATION_LIMIT);
	else if (locations.length < MIN_LOCATION_LIMIT) rejections.push('not_enough_locations');

	// Validate duration
	if (!duration || typeof duration !== 'number') duration = 600;
	else if (duration > MAX_TIMER_LIMIT) duration = MAX_TIMER_LIMIT;
	else if (duration < MIN_TIMER_LIMIT) duration = MIN_TIMER_LIMIT;

	let playersMap: Map<string, Player> = new Map();

	let room: Room = new Room({
		name: name,
		language: language,
		isPublic: isPublic,

		host: host,

		spyCount: spyCount,
		locations: locations
	});
	let timer: Timer = new Timer(duration, room.id);

	// Convert to JSON string to store it on Redis
	let roomJSON: string = JSON.stringify(room);

	G_rooms.set(room.id, roomJSON);
}

export default router;