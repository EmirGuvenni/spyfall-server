import * as config from "@config/constants";

interface QuestionOptions {
	roomID: string;
	fromID: string;
	toID: string;

	content: string;
}

export default class Question {
	public readonly roomID: string;
	public readonly fromID: string;
	public readonly toID: string;

	public content: string;
	public answer?: string;

	public askedAt: number = Date.now();
	public answeredAt?: number;

	public setAnswer = (answer: string) => {
		if (answer.length > config.MAX_ANSWER_LENGTH) return 'answer_too_long';

		this.answer = answer;
		this.answeredAt = Date.now();
	}

	constructor(options: QuestionOptions) {
		this.roomID = options.roomID;
		this.fromID = options.fromID;
		this.toID = options.toID;

		this.content = options.content;
	}
}
