import { EventEmitter } from 'events';

import Collection from '@discordjs/collection';

type Nullable<T> = T | null;
type Constructor<T> = { new (): T; };

export class PluginAPI extends EventEmitter {
	private plugins: Collection<string, Plugin>;

	public constructor();
	
	public get(id: string): Nullable<Plugin>;

	public register<T extends Plugin>(PluginClass: Constructor<T>): Promise<void>;
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

	public constructor(info: PluginInfo);

	public abstract load(): Promise<void>;
	public abstract start(): Promise<void>;
}

declare global {
	interface Window {
		$: JQueryStatic;
		BetterTanki: {
			Plugin: typeof Plugin,
			PluginAPI: PluginAPI
		};
	}
}
