// Import libraries
import { TypedEmitter } from "tiny-typed-emitter";

interface TimerEvents {
	start: () => void;
	end: () => void;
}

export default class Timer extends TypedEmitter<TimerEvents> {
	public seconds: number;

	constructor(seconds: number) {
		super();

		this.seconds = seconds;
	}

	public start = () => {
		this.emit('start');

		setInterval(() => {
			this.seconds--;

			if (this.seconds === 0)
				this.emit('end');
		}, 1000);
	}
}