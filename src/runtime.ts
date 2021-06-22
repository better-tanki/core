import * as os from 'os';
import * as path from 'path';

import { app, remote } from 'electron';
import { List } from '@assasans/storage';

export enum BuildMode {
	Development,

	ClosedBeta,
	OpenBeta,

	Production,
}

export class Runtime {
	private static instance: Runtime;
	public static get(): Runtime {
		if(!this.instance) this.instance = new Runtime();
		return this.instance;
	}

	public readonly version: string;
	public readonly mode: BuildMode;

	public readonly ignoreList: List<string>;

	private constructor() {
		this.version = '5.0.2-eol';
		this.mode = BuildMode.Development;

		this.ignoreList = new List<string>();
	}

	public async init(): Promise<void> {

	}

	public static get appPath(): string {
		return (app ?? remote.app).getAppPath();
	}

	public static get userData(): string {
		return path.join(os.homedir(), 'better-tanki');
	}
}
