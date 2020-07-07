import { EventEmitter } from 'events';

import Collection from '@discordjs/collection';

type Nullable<T> = T | null;
type Constructor<T> = { new (): T; };

export class PluginAPI extends EventEmitter {
	private plugins: Collection<string, Plugin>;

	public constructor() {
		super();
		throw new Error('Stub');	
	}
	
	public get(id: string): Nullable<Plugin> {
		throw new Error('Stub');	
	}

	public register<T extends Plugin>(PluginClass: Constructor<T>): Promise<void> {
		throw new Error('Stub');	
	}
}

export interface PluginInfo {
	readonly id: string;
	readonly name: string;
	readonly description: string | null;
	readonly version: string;
	readonly author: string;
}

export abstract class Plugin {
	public readonly id: string;
	public readonly name: string;
	public readonly description: string | null;
	public readonly version: string;
	public readonly author: string;

	public api: {};

	public constructor(info: PluginInfo) {
		const {
			id, name, description,
			version, author
		} = info;

		this.id = id;
		this.name = name;
		this.description = description;
		this.version = version;
		this.author = author;

		this.api = {};
	}

	public abstract load(): Promise<void>;
	public abstract start(): Promise<void>;
}

/*declare global {
	interface Window {
		$: JQueryStatic;
		BetterTanki: {
			Plugin: typeof Plugin,
			PluginAPI: PluginAPI
		};
	}
}*/
