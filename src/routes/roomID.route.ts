// Import libraries
import { Router, Request, Response } from "express";

// Import rooms
import { G_rooms } from "../index";

// Import classes
import Room from "../classes/Room";
import { ROOM_ID_LENGTH } from "../config/constants";

const router: Router = Router();

router.route('/:roomID')
	.get(getRouteHandler);

function getRouteHandler(req: Request, res: Response): void {
	let roomID: string = req.params.roomID;
	console.log(roomID);

	// validate the room ID
	if (!roomID) {
		res.send('no_roomID').end();
		return;
	}
	if (roomID.length !== ROOM_ID_LENGTH) {
		res.send('invalid_roomID').end();
		return;
	}

	G_rooms.get(roomID, (err, roomJSON) => {
		if (err) {
			res.status(500).end();
			return;
		}

		if (roomJSON) {
			let room: Room = JSON.parse(roomJSON);
			// TODO connect to the room with socket.io

			res.send(roomJSON).status(200).end();
			return;
		}
		else {
			res.send('room_not_found').status(404).end();
		}
	});
}

export default router;