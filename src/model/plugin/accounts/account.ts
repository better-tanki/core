export interface AccountInfo {
	username: string;

	password: string;
	passwordEncrypted: Buffer;
}

export class Account {
	public username: string;

	public password: string;
	public passwordEncrypted: Buffer;

	public constructor(info: AccountInfo) {
		const {
			username,
			password, passwordEncrypted
		}: AccountInfo = info;

		this.username = username;

		this.password = password;
		this.passwordEncrypted = passwordEncrypted;
	}
}
