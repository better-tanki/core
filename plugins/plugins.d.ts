declare namespace Bt {
	export namespace Internals {
		export type Nullable<T> = T | null;
		export type Constructor<T> = { new (): T; };

		export class EventEmitter {
			public addListener(event: string | symbol, listener: (...args: any[]) => void): this;
				
			public prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
			public prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
	
			public removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
			public removeAllListeners(event?: string | symbol): this;
	
			public on(event: string | symbol, listener: (...args: any[]) => void): this;
			public once(event: string | symbol, listener: (...args: any[]) => void): this;
	
			public off(event: string | symbol, listener: (...args: any[]) => void): this;
			
			public setMaxListeners(n: number): this;
			public getMaxListeners(): number;
	
			public listeners(event: string | symbol): Function[];
			public rawListeners(event: string | symbol): Function[];
			
			public listenerCount(type: string | symbol): number;
	
			public emit(event: string | symbol, ...args: any[]): boolean;
	
			public eventNames(): Array<string | symbol>;
		}
	
		/**
		 * @extends EventEmitter
		 */
		export class PluginAPI extends EventEmitter {
			public constructor();
			
			public allocateUI(plugin: Api.Plugin): HTMLDivElement;

			public get(id: string): Internals.Nullable<Api.Plugin>;
		
			public register<T extends Api.Plugin>(PluginClass: Internals.Constructor<T>): Promise<Internals.Nullable<T>>;
		}
	
		export interface ResourceLoader {
			js: (url: string, async?: boolean) => void;
			localJS: (url: string, internal?: boolean, async?: boolean) => void;
	
			css: (url: string) => void;
			localCSS: (url: string, internal?: boolean) => void;
		}

		export interface SettingsProps {
		
		}
		
		export interface SettingsState {
			fadeIn: boolean;
		
			fadeOut: boolean;
		
			_visible: boolean;
			visible: boolean;
		}

		export class Settings extends React.Component<SettingsProps, SettingsState> {
			public show(): Promise<void>;
			public hide(): Promise<void>;
		}

		export interface ConsoleProps {
		
		}
		
		export interface ConsoleState {
			fadeIn: boolean;
		
			fadeOut: boolean;
		
			_visible: boolean;
			visible: boolean;
		}

		export class Console extends React.Component<ConsoleProps, ConsoleState> {
			public show(): Promise<void>;
			public hide(): Promise<void>;
		}

		export class App extends React.Component {
			// public preloader: React.RefObject<Preload>;
			// public loading: React.RefObject<Loading>;
		
			public settings: React.RefObject<Settings>;

			public console: React.RefObject<Console>;

			public addPlugin(ComponentConstructor: React.ComponentClass): void;
		}

		let ReactApp: Nullable<App>;
		let TankiStore: Nullable<any>;

		let spectator: boolean;
		let hideBars: boolean;

		let __BtInternals: true;
	}
	
	export namespace Api {
		export interface PluginInfo {
			readonly id: string;
			readonly name: string;
			readonly description: string | null;
			readonly version: string;
			readonly author: string;
		}
	
		export type NoApi = {};
	
		export abstract class Plugin<ApiType = NoApi> {
			public readonly id: string;
			public readonly name: string;
			public readonly description: string | null;
			public readonly version: string;
			public readonly author: string;
	
			public abstract api: ApiType;
	
			public constructor(info: PluginInfo);
	
			public abstract load(): Promise<void>;
			public abstract start(): Promise<void>;
		}
	
		export const PluginAPI: Internals.PluginAPI;
	
		export const ResourceLoader: Internals.ResourceLoader;
	}

	export namespace Helpers {
		export class AES {
			public static generateKey(key: Buffer): Promise<Buffer>;

			public static encrypt(content: Buffer, key: Buffer): Promise<Buffer>;
			public static decrypt(encrypted: Buffer, key: Buffer): Promise<Buffer>;
		}

		export class Buffer {
			public static getOctets(buffer: Buffer): number[];
		}

		export class DOM {
			public static copyEvents(source: HTMLElement, target: HTMLElement, events?: string[]): void;
		}

		export class FS {
			public static exists(path: string): Promise<boolean>;
			public static copy(source: string, destination: string): Promise<void>;
		}
	}

	export namespace Exceptions {
		export class Exception {
			public constructor(message?: string);
		}

		export class InvalidOperation extends Exception {}
	}
}

interface Window {
	$: JQueryStatic;

	React: typeof import('react');
	ReactDOM: typeof import('react-dom');
	ReactRouter: typeof import('react-router-dom');

	__earlyInit__: () => Promise<void>;
	__init__: () => Promise<void>;
}
