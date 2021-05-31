export default class Player {
	public readonly id: string;
	public username: string;

	public readonly roomID: string;

	public role: string;
	public location?: string;
	public isSpy: boolean;

	constructor(options: Player) {
		this.id = options.id;
		this.username = options.username;

		this.roomID = options.roomID;

		this.role = options.role;
		this.location = options.location;
		this.isSpy = options.isSpy;
	}
}