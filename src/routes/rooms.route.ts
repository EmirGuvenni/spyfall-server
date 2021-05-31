// Import libraries
import { Router, Request, Response } from "express";

// Import rooms
import { G_rooms } from "@index";

// Import classes
import Room from "@class/Room";

const router: Router = Router();

router.route('/')
	.get(getRouteHandler);

interface RoomDisplay {
	id: string;
	name: string;
	icon: string;
	language: string;

	playerCount: number;
	spyCount: number;
}

function getRouteHandler(req: Request, res: Response): void {
	let payload: RoomDisplay[] = [];

	// Retirieve rooms
	G_rooms.keys('*', (err, keys) => {
		if (err) {
			res.send('failed_to_get_rooms');
			return;
		}

		if (keys) {
			for (let key of keys) {
				// Get the room
				G_rooms.get(key, (err, room) => {
					if (err || !room) return;

					let roomParsed: Room = JSON.parse(room);

					if (roomParsed.isPublic) {
						let roomDisplay: RoomDisplay = {
							id: roomParsed.id,
							name: roomParsed.name,
							icon: roomParsed.icon,
							language: roomParsed.language,

							spyCount: roomParsed.spyCount,
							playerCount: roomParsed.players.size
						}

						payload.push(roomDisplay);
					}
				});
			}

			res.send(payload).end();
		}
		else
			res.send('no_rooms_found').end();
	})
}
