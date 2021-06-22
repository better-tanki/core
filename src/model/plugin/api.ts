import { EventEmitter } from 'events';
import { Collection } from '@assasans/storage';

import { Plugin } from './plugin';
import { Nullable, Constructor } from '../../helper/type';

export class PluginAPI extends EventEmitter {
	private plugins: Collection<string, Plugin>;

	public constructor() {
		super();

		this.plugins = new Collection<string, Plugin>();
	}

	public allocateUI(plugin: Plugin): HTMLDivElement {
		if(!this.plugins.has(plugin.id)) throw new Error(`Plugin '${plugin.id}' is not registered`);

		const element: HTMLDivElement = document.createElement('div');
		element.id = `btp__${plugin.id}--internal`;

		document.body.prepend(element);

		return element;
	}
	
	public get(id: string): Nullable<Plugin> {
		return this.plugins.get(id);
	}

	public async register<T extends Plugin>(PluginClass: Constructor<T>): Promise<Nullable<T>> {
		const plugin: T = new PluginClass();
		this.plugins.set(plugin.id, plugin);

		// console.log(plugin);

		// Log.plugin.debug(`Registering plugin ${chalk.greenBright}...`);

		// window.setLoadingModule(plugin.name);

		this.emit('register', plugin);

		try {
			console.log(`Loading plugin ${plugin.name}...`);

			await plugin.load();
			this.emit('load', plugin);

			$(document).ready(async () => {
				try {
					await plugin.start();
					this.emit('start', plugin);

					/* if(Bt.Api.PluginAPI.get('notification-api')) {
						(Bt.Api.PluginAPI.get('notification-api')!.api as NotificationAPI).create({
							title: 'Bt.Api',
							message: `Загружен плагин <b>${plugin.name} ${plugin.version}</b> от <b>${plugin.author}</b>`,
							duration: 5000
						});
					} */
				} catch(error) {
					this.emit('startError', plugin, error);
				}
			});

			return plugin;
		} catch(error) {
			console.error(`Plugin ${plugin.name} load error: ${error.toString()}`);

			this.emit('loadError', plugin, error);
		}

		return null;
	}
}
