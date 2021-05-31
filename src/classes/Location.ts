export default class Location {
	public name: string;
	public roles: string[];

	constructor(name: string, roles: string[]) {
		this.name = name;
		this.roles = roles;
	}
}