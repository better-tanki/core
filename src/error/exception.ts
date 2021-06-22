export class Exception extends Error {
	public constructor(message?: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class InvalidOperationException extends Exception {}

export class ManuallyInitiatedCrashException extends Exception {}
