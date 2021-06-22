import * as fs from 'promise-fs';

export class FSHelper {
	private constructor() {}

	public static async exists(path: string): Promise<boolean> {
		try {
			await fs.stat(path);
			return true;
		} catch {
			return false;
		}
	}

	public static async copy(source: string, destination: string): Promise<void> {
		const buffer: Buffer = await fs.readFile(source, {
			encoding: null
		});

		await fs.writeFile(destination, buffer, {
			encoding: null
		});
	}
}
