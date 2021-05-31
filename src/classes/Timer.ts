// Import libraries
import { TypedEmitter } from "tiny-typed-emitter";

interface TimerEvents {
	start: (roomID: string) => void;
	end: (roomID: string) => void;
}

export default class Timer extends TypedEmitter<TimerEvents> {
	public seconds: number;
	public roomID: string;

	constructor(seconds: number, id: string) {
		super();

		this.seconds = seconds;
		this.roomID = id;
	}

	public start = () => {
		this.emit('start', (this.roomID));

		setInterval(() => {
			this.seconds--;

			if (this.seconds === 0)
				this.emit('end', (this.roomID));
		}, 1000);
	}
}