/// <reference path="../plugins/plugins.d.ts" />

import * as decompress from 'decompress';
import * as rp from 'request-promise';
import * as Bluebird from 'bluebird';
import * as minimist from 'minimist';
import * as fs from 'promise-fs';
import * as WebSocket from 'ws';
import * as chalk from 'chalk';
import * as path from 'path';
import * as _ from 'lodash';
import * as url from 'url';

import { DateTime } from 'luxon';
import { List } from '@assasans/storage';
import { remote, NativeImage, net } from 'electron';

import { App } from './frontend/app';
import { Servers } from './frontend/servers';

import { Log } from './log';
import { Runtime } from './runtime';
import { Plugin } from './model/plugin/plugin';
import { Nullable, Constructor } from './helper/type';
import { NotificationAPI, Notification } from './api/notification';
import { EventListener, EventHandler } from './model/event/listener';

document.addEventListener('keydown', async ({ key, ctrlKey, shiftKey, metaKey, altKey }) => {
	if(
		(ctrlKey && shiftKey && key === 'I') ||
		(metaKey && altKey && key === 'i')
	) {
		remote.getCurrentWebContents().toggleDevTools();
	}

	if(key === 'F12') {
		const image: NativeImage = await remote.getCurrentWebContents().capturePage();
		const png: Buffer = image.toPNG();

		const dir: string = path.join(Runtime.userData, 'screenshots');

		if(!await Bt.Helpers.FS.exists(dir)) {
			await fs.mkdir(dir);
		}

		const filename: string = `screenshot_${DateTime.local().toFormat('dd-MM-yyyy_HH-mm-ss')}.png`;
		const file: string = path.join(dir, filename);

		await fs.writeFile(file, png, {
			encoding: null
		});

		(Bt.Api.PluginAPI.get('notification-api')!.api as NotificationAPI).create(new Notification({
			title: 'Скриншот создан',
			message: `${filename}`,

			icon: image.toDataURL(),
			iconBig: true,

			duration: 5000
		}));
	}

	if(ctrlKey && key === 'r') {
		location.reload();
	}

	if(key === 'F11') {
		if(!document.fullscreenElement) {
			await document.documentElement.requestFullscreen();
		} else {
			await document.exitFullscreen();
		}
	}

	if(key === 'F2') {
		window.__speed = !window.__speed;
	}

	/* if(key === 'F3') {
		window.isSpectator = !window.isSpectator;

		alert(`Spectator: ${window.isSpectator}`);
	} */

	if(key === 'F4') {
		window.delayPackets = !window.delayPackets;

		console.log(`Delay packets: ${window.delayPackets}`);

		if(window.delayPackets === false) {
			window.flushPackets();
		}
	}

	if(key === 'F6') {
		window.ignorePackets = !window.ignorePackets;

		console.log(`Ignore packets: ${window.ignorePackets}`);
	}

	if(key === 'F3') {
		if(!window.capturePackets) {
			window.capturedPackets = [];
		}

		window.capturePackets = !window.capturePackets;

		console.log(`Capture packets: ${window.capturePackets}`);
	}

	if(key === 'F9') {
		if(!Bt.Internals.ReactApp) return;
		if(!Bt.Internals.ReactApp.console.current) return;

		const consoleComponent: Bt.Internals.Console = Bt.Internals.ReactApp.console.current;

		if(!consoleComponent.state._visible) {
			consoleComponent.show();
		} else {
			consoleComponent.hide();
		}
	}
});

declare global {
	interface Element {
		_eventListeners: List<EventListener>;

		getEventListeners<T extends string = string>(type?: T): List<EventListener<T>>;
	}

	interface Node {
		_eventListeners: List<EventListener>;

		getEventListeners<T extends string = string>(type?: T): List<EventListener<T>>;
	}
}

class ListenerTracker {
	public constructor() {
		const _Element = {
			'addEventListener': Element.prototype.addEventListener,
			'removeEventListener': Element.prototype.removeEventListener
		};

		const instance: ListenerTracker = this;

		Node.prototype.addEventListener = function(type: string, handler: EventHandler, options?: AddEventListenerOptions) {
			if(!this._eventListeners) this._eventListeners = new List<EventListener>();

			// console.log(`Add event listener ${type} on ${this.tagName}#${this.id}.${this.className}`);
			_Element.addEventListener.call(this, type, handler, options);

			this._eventListeners.add(new EventListener({
				node: this,

				type: type,
				handler: handler
			}));

			return this._eventListeners;
		};

		Node.prototype.removeEventListener = function(type: string, handler: EventHandler, options?: AddEventListenerOptions) {
			if(!this._eventListeners) this._eventListeners = new List<EventListener>();

			// console.log(`Remove event listener ${type} on ${this.tagName}#${this.id}.${this.className}`);
			_Element.removeEventListener.call(this, type, handler, options);

			const existing: Nullable<number> = this._eventListeners.findKey((listener: EventListener) => listener.handler === handler);

			if(existing !== null) {
				// this._eventListeners.delete(existing);
			}
		};

		Node.prototype.getEventListeners = function<T extends string = string>(type?: T): List<EventListener<T>> {
			if(!this._eventListeners) this._eventListeners = new List<EventListener>();

			const names: string[] = [];
			const inlineEventListeners: List<EventListener> = new List<EventListener>();

			const ownEvents: string[] = Object.getOwnPropertyNames(this.constructor.prototype)
				.filter((name: string) => name.startsWith('on'));

			names.push(...ownEvents);

			let currentPrototype = this.constructor.prototype;
			while((currentPrototype = currentPrototype.__proto__) !== null) {
				const currentNames: string[] = Object.getOwnPropertyNames(currentPrototype)
					.filter((name: string) => name.startsWith('on'));
				names.push(...currentNames);
			}

			names.forEach((event: string) => {
				const handler: Nullable<EventHandler> = (this as unknown as { [event: string]: Nullable<EventHandler> })[event];
				if(!handler) return;

				inlineEventListeners.add(new EventListener({
					node: this,

					type: event.slice(2),
					handler: handler
				}));
			});

			if(type === undefined) return this._eventListeners.concat(inlineEventListeners) as List<EventListener<T>>;
			return this._eventListeners
				.concat(inlineEventListeners)
				.filter((listener: EventListener) => listener.type === type) as List<EventListener<T>>;
		};
	};
}

const tracker = new ListenerTracker();

async function __init__(): Promise<void> {
// 	HTMLCanvasElement.prototype._getContext = HTMLCanvasElement.prototype.getContext;
// 	HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, contextId: string, options?: any): any {
// 		const context: any = this._getContext(contextId, {
// 			...options,
// 			preserveDrawingBuffer: true
// 		});
// 		context.preserveDrawingBuffer = true;

// 		// console.log(this, contextId, context);

// 		return context;
// 	};

	// document.body.addEventListener('contextmenu', async () => {
	// 	await socket.pressShift();
	// });

	window.$ = await import('jquery');

	window.React = await import('react');
	window.ReactDOM = await import('react-dom');
	window.ReactRouter = await import('react-router-dom');

	// FEATURE(Assasans): THEME_GLASS
	Bt.Api.ResourceLoader.localCSS('../static/css/preload.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/plugins.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/accounts.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/settings.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/console.css', true);

	Bt.Api.ResourceLoader.localCSS('../static/css/notification/notification.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/modal/modal.css', true);

	Bt.Api.ResourceLoader.localCSS('../static/css/plugins/list.css', true);

	Bt.Api.ResourceLoader.localCSS('../static/css/control/list/list.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/tree/tree.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/button/button.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/image.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/progress.css', true);

	Bt.Api.ResourceLoader.localCSS('../static/css/battle/results.css', true);

	Bt.Api.ResourceLoader.localCSS('../static/css/control/switch.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/checkbox.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/dropdown.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/textedit.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/control/settings/section.css', true);

	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/common.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/main-menu.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/chat.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/garage.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/auth.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/settings.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/quests.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/battle.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/battle-list.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/battle-modes.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/friends.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/clans.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/shop.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/containers.css', true);
	Bt.Api.ResourceLoader.localCSS('../static/css/theme/glass/challenge.css', true);

	Node.prototype._appendChild = Node.prototype.appendChild;
	Node.prototype.appendChild = function appendChild<T extends Node>(this: Node, newChild: T): T {
		const child: T = this._appendChild(newChild);

		{
			// FEATURE(Assasans): FATAL_ERROR_IGNORE
			if(newChild instanceof HTMLDivElement && newChild.getAttribute('data-style') === 'FatalErrorScreenStyle-content') {
				newChild.style.flexDirection = 'column';

				const className: string = newChild.querySelector('div[data-style="FatalErrorScreenStyle-restartButton"]')!.className;

				const ignoreElement: HTMLDivElement = document.createElement('div');
				const ignoreText: HTMLSpanElement = document.createElement('span');

				ignoreElement.className = className;
				ignoreElement.setAttribute('data-style', 'FatalErrorScreenStyle-restartButton');

				ignoreElement.style.marginTop = '-1.3em';
				ignoreElement.style.marginBottom = '0';

				ignoreText.textContent = 'Игнорировать';

				ignoreElement.appendChild(ignoreText);

				ignoreElement.addEventListener('click', () => {
					if(!Bt.Internals.TankiStore) return;

					Bt.Internals.TankiStore.state.system.fatalError = null;
					Bt.Internals.TankiStore.dispatchFunction({});
				});

				newChild.appendChild(ignoreElement);
			}
		}

		if(newChild instanceof HTMLUListElement && newChild.getAttribute('data-style') === 'SettingsComponentStyle-blockMenuOptions') {
			// const tabs: HTMLUListElement = (document.querySelector('ul[SettingsComponentStyle-blockMenuOptions]') as Nullable<HTMLUListElement>)!;

			const settingsElement: HTMLLIElement = document.createElement('li');

			settingsElement.classList.add('bt-settings-tab');
			settingsElement.classList.add('bt-settings-tab--bt');

			settingsElement.setAttribute('data-style', 'SettingsComponentStyle-menuItemOptions');

			const spanElement: HTMLSpanElement = document.createElement('span');

			spanElement.textContent = 'BetterTanki';

			settingsElement.appendChild(spanElement);

			settingsElement.addEventListener('click', () => {
				if(!Bt.Internals.ReactApp) return;
				if(!Bt.Internals.ReactApp.settings.current) return;

				Bt.Internals.ReactApp.settings.current.show();
			});

			newChild.appendChild(settingsElement);
		}
	};

	Node.prototype.___appendChild = Node.prototype.appendChild;
	Node.prototype.appendChild = function appendChild<T extends Node>(this: Node, newChild: T): T {
		const child: T = this.___appendChild(newChild);

		if(newChild instanceof Element) {
			Array.from(newChild.querySelectorAll('div[data-style="QuestsComponentStyle-questBlock"] > div > div:last-child')).map((element: Element) => {
				const container: HTMLDivElement = (element.parentElement as Nullable<HTMLDivElement>)!;
				console.log(container);

				const isCompleted: boolean = element.querySelector('div[data-style="DailyQuestComponentStyle-claimReward"]') !== null;
				if(isCompleted) {
					if(!element.classList.contains('bt-quest-button--claim')) element.classList.add('bt-quest-button--claim');
					if(!container.classList.contains('bt-quest--claim')) container.classList.add('bt-quest--claim');
				} else {
					const isChange: boolean = element.querySelector('span')!.classList.length > 0;
					if(isChange) {
						if(!element.classList.contains('bt-quest-button--change')) element.classList.add('bt-quest-button--change');
						if(!container.classList.contains('bt-quest--change')) container.classList.add('bt-quest--change');
					} else {
						if(!element.classList.contains('bt-quest-button--play')) element.classList.add('bt-quest-button--play');
						if(!container.classList.contains('bt-quest--play')) container.classList.add('bt-quest--play');
					}
				}
			});

			Array.from(newChild.querySelectorAll('div[data-style="QuestsComponentStyle-mainQuestBlock QuestsComponentStyle-scrollBlock"] > div > div[data-style="MainQuestComponentStyle-mainContainer"] > div[data-style="MainQuestComponentStyle-contentContainer"] > div[data-style="MainQuestComponentStyle-buttonContainer"]')).map((element: Element) => {
				const container: HTMLDivElement = ((element.parentElement?.parentElement?.parentElement ?? null) as Nullable<HTMLDivElement>)!;
				console.log(container);

				const actionElement: Nullable<HTMLSpanElement> = element.querySelector('span') as Nullable<HTMLSpanElement>;
				if(actionElement) {
					if(actionElement.classList.contains('irqAQK')) {
					}

					// Gold text
					if(actionElement.classList.contains('iMCqIc')) {
						const hasTimer: boolean = element.querySelector('div[data-style="MainQuestComponentStyle-buttonContainer"] > div > span') !== null;
						if(hasTimer) {
							if(!element.classList.contains('bt-quest-button--claim')) element.classList.add('bt-quest-button--claim');
							if(!container.classList.contains('bt-quest--claim')) container.classList.add('bt-quest--claim');
						} else {
							if(!element.classList.contains('bt-quest-button--unlock')) element.classList.add('bt-quest-button--unlock');
							if(!container.classList.contains('bt-quest--unlock')) container.classList.add('bt-quest--unlock');
						}
					}

					// White text
					if(actionElement.classList.contains('cIKBKi')) {
						if(!element.classList.contains('bt-quest-button--play')) element.classList.add('bt-quest-button--play');
						if(!container.classList.contains('bt-quest--play')) container.classList.add('bt-quest--play');
					}
				} else {
					if(!element.classList.contains('bt-quest-button--empty')) element.classList.add('bt-quest-button--empty');
					if(!container.classList.contains('bt-quest--empty')) container.classList.add('bt-quest--empty');
				}
			});
		}

		return child;
	};

	// CSP test
	// $('body').append($('<img src="https://siava.ru/forum/gallery/image/495/medium" style="position: absolute; z-index: 1;">'));

	const file: string = path.basename(url.parse(window.location.href).pathname ?? '');

	if(file === 'void.html') {
		const element: HTMLDivElement = document.createElement('div');
		element.id = 'bt-servers-container';
		document.body.prepend(element);

		const servers: Servers = window.ReactDOM.render(
			window.React.createElement(Servers, null),
			element
		);
		return;
	}

	if(file !== 'play' && file !== 'index.html') return;

	const element: HTMLDivElement = document.createElement('div');
	element.id = 'bt-body';
	document.body.prepend(element);

	const app: App = window.ReactDOM.render(
		window.React.createElement(App, null),
		element
	);

	Bt.Internals.ReactApp = app;

	{
		const apiDir: string = path.join(__dirname, 'api');

		const plugins: string[] = await Bluebird.filter(fs.readdir(apiDir), async (name: string) => {
			const stats: fs.Stats = await fs.stat(path.join(apiDir, name));
			return stats.isDirectory();
		});

		await Bluebird.each(plugins, async (name: string) => {
			try {
				const fullPath: string = path.join(apiDir, name, 'index.js');

				const module = await import(fullPath);
				const PluginClass: Constructor<Plugin> = module.default;

				await Bt.Api.PluginAPI.register(PluginClass);
			} catch(error) {
				console.error(error);
			}
		});
	}

	const pluginsDir: string = path.join(__dirname, '../', 'plugins');

	if(!await Bt.Helpers.FS.exists(pluginsDir)) {
		await fs.mkdir(pluginsDir);
	}

	const apiDeclaration: string = path.join(pluginsDir, 'plugins.d.ts');
	if(!await Bt.Helpers.FS.exists(apiDeclaration)) {
		await Bt.Helpers.FS.copy(path.join(Runtime.appPath, 'plugins/plugins.d.ts'), apiDeclaration);
	}

	const plugins: string[] = await Bluebird.filter(fs.readdir(pluginsDir), async (name: string) => {
		const stats: fs.Stats = await fs.stat(path.join(pluginsDir, name));
		return stats.isDirectory();
	});

	await Bluebird.each(plugins, async (name: string) => {
		try {
			const fullPath: string = path.join(pluginsDir, name);

			const module = await import(fullPath);
			const PluginClass: Constructor<Plugin> = module.default;

			// await Bt.Api.PluginAPI.register(PluginClass);
		} catch(error) {
			console.error(error);
		}
	});

	app.preloader.current?.setLoading({
		title: 'Tanki Online',
		subtitle: null,
		progress: 20
	});

	const port: number = 9222;

	const pages: Page[] = await rp(`http://localhost:${port}/json/list`, {
		json: true
	});

	const page: Nullable<Page> = pages.find((page: Page) => !page.url.startsWith('devtools://')) ?? null;
	if(!page) throw new Error('Page not found');

	const cdp: CDP = new CDP(port);
	const socket: CDPSocket = await cdp.connect(page.id);

	{
		// FEATURE(Assasans): SHIFT_ON_RIGHT-CLICK
		// Press Shift on right-click
		// Was implemented for Hopper events on Skyscrapers map

		document.body.addEventListener('contextmenu', async () => {
			await socket.pressShift();
		});

		document.body.addEventListener('mousedown', async ({ button }) => {
			if(button === 2) {
				await socket.pressShift();
			}
		});
	}
}
window.__init__ = __init__;

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOM content loaded');
	__init__();
});


interface Page {
	id: string;

	title: string;
	type: string;
	description: string;

	url: string;

	devtoolsFrontendUrl: string;
	webSocketDebuggerUrl: string;
}

type Packet = PacketOK | PacketError;

interface PacketOK<T = unknown> {
	id: number,
	result: T;
}

interface PacketError {
	id?: number;
	error: {
		code: number;
		message: string;
	};
}

interface SendPacket<T = {}> {
	id: number;
	method: string;
	params: T;
}

class CDPSocket {
	public readonly port: number;
	public readonly page: string;

	private socket: Nullable<WebSocket>;

	public constructor(port: number, page: string) {
		this.port = port;
		this.page = page;

		this.socket = null;
	}

	public async connect(): Promise<void> {
		return new Bluebird((resolve, reject) => {
			this.socket = new WebSocket(`ws://localhost:${this.port}/devtools/page/${this.page}`);

			this.socket.on('error', (error: Error) => {
				Log.cdp.error(error);
				return reject(error);
			});

			this.socket.on('open', () => {
				return resolve();
			});
		});
	}

	public async send(packet: SendPacket<unknown>): Promise<Packet> {
		return new Bluebird((resolve, reject) => {
			if(!this.socket) throw new Error('CDPSocket is not connected');

			const handler = (data: WebSocket.Data) => {
				const incomingPacket: Packet = JSON.parse(data.toString());

				if(incomingPacket.id === packet.id) {
					this.socket?.off('message', handler);
					return resolve(incomingPacket);
				}
			};

			this.socket.on('message', handler);

			this.socket.send(JSON.stringify(packet));
		});
	}

  public async pressShift(): Promise<void> {
    await this.send({
			id: 1,
			method: 'Input.dispatchKeyEvent',
			params: {
				type: 'keyDown',
				code: 'ShiftLeft',
				key: 'Shift'
			}
		});

		await Bluebird.delay(0);

    await this.send({
			id: 1,
			method: 'Input.dispatchKeyEvent',
			params: {
				type: 'keyUp',
				code: 'ShiftLeft',
				key: 'Shift'
			}
		});
  }

  public async pressNumber(number: number): Promise<void> {
    await this.send({
			id: 1,
			method: 'Input.dispatchKeyEvent',
			params: {
				type: 'keyDown',
				code: `Digit${number}`,
				key: `${number}`
			}
		});

		await Bluebird.delay(10);

    await this.send({
			id: 1,
			method: 'Input.dispatchKeyEvent',
			params: {
				type: 'keyUp',
				code: `Digit${number}`,
				key: `${number}`
			}
		});
  }
}

class CDP {
	public readonly port: number;

	public constructor(port: number) {
		this.port = port;
	}

	public async connect(page: string): Promise<CDPSocket> {
		const socket: CDPSocket = new CDPSocket(this.port, page);
		await socket.connect();
		return socket;
	}
}
