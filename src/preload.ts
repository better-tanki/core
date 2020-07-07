import * as rp from 'request-promise';
import * as Bluebird from 'bluebird';
import * as fs from 'promise-fs';
import * as chalk from 'chalk';
import * as path from 'path';
import * as _ from 'lodash';
import * as url from 'url';

import Collection from '@discordjs/collection';

import { EventEmitter } from 'events';
import { remote } from 'electron';

import {
	NotificationAPI,
	ModalAPI, Modal, ButtonType
} from './api-imports';

import Logger from './helper/logger';

document.addEventListener('keyup', ({ key, ctrlKey, shiftKey, metaKey, altKey }) => {
	if(key === 'F12' ||
		(ctrlKey && shiftKey && key === 'I') ||
		(metaKey && altKey && key === 'i')
	) {
		remote.getCurrentWebContents().openDevTools();
	}

	if(key === 'F11') {
		if(document.fullscreenElement) {
			if(document.exitFullscreen) {
				document.exitFullscreen();

				if(window.BetterTanki.PluginAPI.get('notification-api')) {
					(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
						title: 'Полноэкранный режим',
						message: 'Вы вышли из полноэкранного режима',
						duration: 5000
					});
				}
			}
		} else {
			document.documentElement.requestFullscreen();
				
			if(window.BetterTanki.PluginAPI.get('notification-api')) {
				(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
					title: 'Полноэкранный режим',
					message: 'Вы вошли в полноэкранный режим',
					duration: 5000
				});
			}
		}
	}

	if(key === 'F10') {
		const element = $('div#bt-plugins-modal__container');
		if(element.css('display') === 'none') {
			element.css('display', 'flex');
		} else {
			element.css('display', 'none');
		}
	}
});

const cssHashPattern: RegExp = new RegExp(/<link rel="stylesheet" href="\/play\/static\/css\/main\.(?<hash>[a-f0-9]{8})\.css">/);
const jsHashPattern: RegExp = new RegExp(/<script type="text\/javascript" src="\/play\/static\/js\/main\.(?<hash>[a-f0-9]{8})\.js"><\/script>/);

async function _init() {
	//window.exports = {};
	window.$ = await import('jquery');

	if(path.basename(url.parse(window.location.href).pathname || '') !== 'main.html') return;

	const html: string = await rp({
		uri: 'https://tankionline.com/play',
		method: 'GET'
	});
	const cssHash: Nullable<string> = (cssHashPattern.exec(html)?.groups || {})['hash'] || null;
	const jsHash: Nullable<string> = (jsHashPattern.exec(html)?.groups || {})['hash'] || null;

	if(!cssHash) {
		window.setLoadingModule('Не удалось получить хеш CSS файла!');
		return;
	}
	if(!jsHash) {
		window.setLoadingModule('Не удалось получить хеш JS файла!');
		return;
	}

	await Bluebird.delay(1000);

	const pluginsDir: string = path.join(__dirname, '..', 'plugins');

	{
		const plugins: string[] = await Bluebird.filter(fs.readdir(pluginsDir), async (name) => {
			const stats: fs.Stats = await fs.stat(path.join(pluginsDir, name));
			return name !== 'src' && name.endsWith('.api') && stats.isDirectory();
		});
		console.log(plugins);
		await Bluebird.each(plugins, async (name: string) => {
			try {
				const fullPath: string = path.join(pluginsDir, name);

				const module = await import(fullPath);
				const PluginClass: Constructor<Plugin> = module.default;

				await window.BetterTanki.PluginAPI.register(PluginClass);
			} catch(error) {
				console.error(error);
			}
		});
	}

	const plugins: string[] = await Bluebird.filter(fs.readdir(pluginsDir), async (name) => {
		const stats: fs.Stats = await fs.stat(path.join(pluginsDir, name));
		return name !== 'src' && !name.endsWith('.api') && stats.isDirectory();
	});
	console.log(plugins);
	await Bluebird.each(plugins, async (name: string) => {
		try {
			const fullPath: string = path.join(pluginsDir, name);

			const module = await import(fullPath);
			const PluginClass: Constructor<Plugin> = module.default;

			await window.BetterTanki.PluginAPI.register(PluginClass);
		} catch(error) {
			console.error(error);
		}
	});

	window.setLoadingModule('Preload / Tanki Online');

	await Bluebird.delay(1000);

	window.setLoadingModule('Tanki Online');

	window.loadCSS(`/play/static/css/main.${cssHash}.css`);
	window.loadJS(`/play/static/js/main.${jsHash}.js`);

	_browser();
}
window._init = _init;

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded');
	_init();
});
//setTimeout(_init, 800);

type Nullable<T> = T | null;
type Constructor<T> = { new (): T; };

export class PluginAPI extends EventEmitter {
	private plugins: Collection<string, Plugin>;

	public constructor() {
		super();

		this.plugins = new Collection<string, Plugin>();
	}
	
	public get(id: string): Nullable<Plugin> {
		const plugin: Plugin | undefined = this.plugins.get(id);
		if(!plugin) return null;
		return plugin;
	}

	public async register<T extends Plugin>(PluginClass: Constructor<T>): Promise<void> {
		const plugin: T = new PluginClass();
		this.plugins.set(plugin.id, plugin);

		console.log(plugin);

		Logger.plugin.debug(`Registering plugin ${chalk.greenBright}...`);

		window.setLoadingModule(plugin.name);

		this.emit('register', plugin);

		try {
			console.log(`Loading plugin ${plugin.name}...`);
			await plugin.load();
			this.emit('load', plugin);

			$(document).ready(async () => {
				try {
					await plugin.start();
					this.emit('start', plugin);

					/*if(window.BetterTanki.PluginAPI.get('notification-api')) {
						(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
							title: 'BetterTanki',
							message: `Загружен плагин <b>${plugin.name} ${plugin.version}</b> от <b>${plugin.author}</b>`,
							duration: 5000
						});
					}*/
				} catch(error) {
					this.emit('startError', plugin, error);
				}
			});
		} catch(error) {
			console.error(`Plugin (${plugin.name}) load error: ${error.toString()}`);
			this.emit('loadError', plugin, error);
		}
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

	public abstract async load(): Promise<void>;
	public abstract async start(): Promise<void>;
}

declare global {
	interface Window {
		$: JQueryStatic;

		_init: () => Promise<void>;
		BetterTanki: {
			Plugin: typeof Plugin,
			PluginAPI: PluginAPI
		};

		loadJS: (url: string) => void;
		loadCSS: (url: string) => void;
		setLoadingModule: (name: string) => void;
	}
}

window.BetterTanki = {
	Plugin: Plugin,
	PluginAPI: new PluginAPI()
};

interface VersionPartial {
	version: string;
	url: string;
	dir: string;
}

interface PluginPartial {
	name: string;
	description: string;
	author: string;
	version: string;
	versions: VersionPartial[];
}

async function _browser(): Promise<void> {
	const plugins: PluginPartial[] = await rp({
		uri: 'https://gitcdn.link/repo/better-tanki/plugins/master/plugins.json',
		method: 'GET',
		json: true
	});

	_renderPlugins(plugins);

	//$('span#bt-plugins__search-icon').on('click', () => {
	$('input#bt-plugins__search').on('keyup', () => {
		const query: Nullable<string> = $('input#bt-plugins__search').val()?.toString() || null;

		const filteredPlugins: PluginPartial[] = plugins.filter((plugin: PluginPartial) => {
			if(query === null) return true;
			return plugin.name.toLowerCase().includes(query.toLowerCase()) ||
				plugin.author.toLowerCase().includes(query.toLowerCase()) ||
				plugin.description.toLowerCase().includes(query.toLowerCase());
		});

		_renderPlugins(filteredPlugins);
	});

	$('div#bt-plugin-info button#bt-plugin-button__install').on('click', async () => {
		const rawId: Nullable<string> = $('div#bt-plugin-info').attr('data-id') || null;
		if(rawId === null) return;

		const id: number = Number(rawId);
		const plugin: PluginPartial = plugins[id];

		//TODO List
		const version: VersionPartial = plugin.versions[0];

		const pluginsDir: string = path.join(__dirname, '..', 'plugins');
		const pluginDir: string = path.join(pluginsDir, version.dir);
		const zipPath: string = path.join(pluginsDir, `${version.dir}.temp.zip`);

		if(window.BetterTanki.PluginAPI.get('notification-api')) {
			(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
				title: 'Менеджер плагинов',
				message: `Скачивание плагина <b>${plugin.name} @ ${version.version}</b>...`,
				duration: 5000
			});
		}
		
		try {
			const response: Buffer = await rp({
				uri: version.url,
				method: 'GET',
				encoding: null
			});

			await fs.writeFile(zipPath, response, {
				encoding: null
			});

			if(window.BetterTanki.PluginAPI.get('notification-api')) {
				(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
					title: 'Менеджер плагинов',
					message: `Извлечение плагина <b>${plugin.name} @ ${version.version}</b>...`,
					duration: 5000
				});
			}
			await decompress(response, pluginDir);

			if(window.BetterTanki.PluginAPI.get('notification-api')) {
				(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
					title: 'Менеджер плагинов',
					message: `Удаление временных файлов для плагина <b>${plugin.name} @ ${version.version}</b>...`,
					duration: 5000
				});
			}
			await fs.unlink(zipPath);

			if(window.BetterTanki.PluginAPI.get('modal-api')) {
				const modal: Modal = (window.BetterTanki.PluginAPI.get('modal-api')?.api as ModalAPI).create({
					title: {
						text: 'Менеджер плагинов'
					},
					message: `Плагин <b>${plugin.name} @ ${version.version}</b> успешно установлен.<br />Перезапустить клиент сейчас?`,
					buttons: [
						ButtonType.Yes,
						ButtonType.No
					]
				});

				console.log(modal.buttons);

				$(modal.buttons[0]).on('click', async () => {
					$('div#bt-modal__container').css('display', 'none');
					$('div.bt-modal').remove();

					if(window.BetterTanki.PluginAPI.get('notification-api')) {
						(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
							title: 'Менеджер плагинов',
							message: `Перезапуск клиента через 3 секунды`,
							duration: 3000
						});
					}

					await Bluebird.delay(3000);

					remote.app.relaunch();
					remote.app.quit();
				});

				$(modal.buttons[1]).on('click', async () => {
					$('div#bt-modal__container').css('display', 'none');
					$('div.bt-modal').remove();
				});
			}
		} catch(error) {
			let message: string = error.message;
			if(error instanceof StatusCodeError) {
				message = `HTTP ${error.statusCode}`;
			}

			if(window.BetterTanki.PluginAPI.get('notification-api')) {
				(window.BetterTanki.PluginAPI.get('notification-api')?.api as NotificationAPI).create({
					title: 'Менеджер плагинов',
					message: `Не удалось установить плагин <b>${plugin.name} @ ${version.version}</b></br>${error.name}: ${message}`,
					duration: 10000,
					titleColor: '#f51212'
				});
			}
		}
	});
}

function _renderPlugins(plugins: PluginPartial[]): void {
	$('div#bt-plugins__list').empty();

	plugins.forEach((plugin: PluginPartial, index: number) => {
		const element = $(`
<div class="bt-plugin" data-id="${index}">
	<div class="bt-plugin__header">
		<span>
		</span>
	</div>
</div>
		`);

		const elementName = $('<span class="bt-plugin__name"></span>');
		const elementVersion = $('<span class="bt-plugin__version"></span>');
		const elementAuthor = $('<span class="bt-plugin__author"></span>');
		const elementDescription = $('<span class="bt-plugin__description"></span>');

		elementName.text(plugin.name);
		elementVersion.text(plugin.version);
		elementAuthor.text(plugin.author);
		elementDescription.text(plugin.description);

		element
			.children('div.bt-plugin__header')
			.children('span')
			.append(elementName)
			.append(elementVersion);

		element
			.children('div.bt-plugin__header')
			.append(elementAuthor);

		element
			.append(elementDescription);

		$('div#bt-plugins__list').append(element);

		element.on('click', (event) => {
			const rawId: Nullable<string> = event.delegateTarget.getAttribute('data-id');
			if(rawId === null) return;

			const id: number = Number(rawId);
			const plugin: PluginPartial = plugins[id];

			$('div#bt-plugins__list div.bt-plugin').removeClass('bt-plugin__selected');
			$(event.delegateTarget).addClass('bt-plugin__selected');

			_renderInfo(plugin, id);
		});
	});
}

import * as decompress from 'decompress';
import { StatusCodeError } from 'request-promise/errors';

function _renderInfo(plugin: PluginPartial, id: number): void {
	$('div#bt-plugin-info').attr('data-id', id);

	$('div#bt-plugin-info span.bt-plugin__name').text(plugin.name);
	$('div#bt-plugin-info span.bt-plugin__description').text(plugin.description);

	$('div#bt-plugin__details-row__name span.bt-plugin__details-row__value').text(plugin.name);
	$('div#bt-plugin__details-row__author span.bt-plugin__details-row__value').text(plugin.author);
	$('div#bt-plugin__details-row__version span.bt-plugin__details-row__value').text(plugin.version);
}
