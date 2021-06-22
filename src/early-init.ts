import * as Bluebird from 'bluebird';
import * as fs from 'promise-fs';
import * as React from 'react';
import * as path from 'path';
import * as _ from 'lodash';

import { DateTime } from 'luxon';
import { EventEmitter } from 'events';
import { NativeImage, remote } from 'electron';

import { App } from './frontend/app';

import { Runtime } from './runtime';
import { FSHelper } from './helper/fs';
import { DOMHelper } from './helper/dom';
import { AESHelper } from './helper/crypto';
import { Console } from './frontend/gui';
import { Exception } from './error/exception';
import { BufferHelper } from './helper/buffer';
import { Plugin } from './model/plugin/plugin';
import { PluginAPI } from './model/plugin/api';
import { Settings } from './frontend/settings';
import { InvalidOperationException } from './error/exception';

async function __earlyInit__(): Promise<void> {
	global.Bt = {
		Internals: {
			EventEmitter: EventEmitter,

			PluginAPI: PluginAPI,

			App: App,

			ReactApp: null,
			TankiStore: null,

			Settings: Settings,
			Console: Console,

			spectator: false,
			hideBars: false,

			__BtInternals: true
		},

		Api: {
			Plugin: Plugin,
			PluginAPI: new PluginAPI(),

			ResourceLoader: {
				js: function js(src: string, async: boolean = true): void {
					const head: HTMLHeadElement = document.querySelector('head')!;
					const script: HTMLScriptElement = document.createElement('script');

					script.src = src;
					script.async = async;

					head.append(script);
				},
				localJS: function localJS(src: string, internal: boolean = false, async: boolean = true): void {
					this.js(`file://${path.join(internal ? __dirname : Runtime.userData, src)}`, async);
				},

				css: function css(src: string): void {
					const head: HTMLHeadElement = document.querySelector('head')!;
					const script: HTMLLinkElement = document.createElement('link');

					script.href = src;
					script.rel = 'stylesheet';

					head.append(script);
				},
				localCSS: function localCSS(src: string, internal: boolean = false): void {
					this.css(`file://${path.join(internal ? __dirname : Runtime.userData, src)}`);
				}
			}
		},

		Helpers: {
			AES: AESHelper,
			Buffer: BufferHelper,
			DOM: DOMHelper,
			FS: FSHelper
		},

		Exceptions: {
			Exception: Exception,
			InvalidOperation: InvalidOperationException
		}
	};

	// FEATURE(Assasans): CORE_MODIFICATIONS
	if(true) {
		// WebSocket.prototype._send = WebSocket.prototype.send;
		// WebSocket.prototype.send = function send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
		// 	console.log(this, data);
		// 	this._send(data);
		// }

		/* Object.defineProperty(Object.prototype, 'resolutionScale', {
			get: function(this: any): any {
				// console.log('Get', this);
				return this.__value__resolutionScale;
			},
			set: function(this: any, value: any): void {
				console.log('Set', this, value);

				this.__value__resolutionScale = 0.5;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'resolutionDivisor', {
			get: function(this: any): any {
				// console.log('Get', this);
				return this.__value__resolutionDivisor;
			},
			set: function(this: any, value: any): void {
				console.log('Set', this, value);

				this.__value__resolutionDivisor = 0;
			},
			enumerable: false,
			configurable: true
		}); */

		Object.defineProperty(Object.prototype, 'spectator', {
			get: function(this: any): boolean {
				// console.log(this);
				// return this.__value_spectator;

				if(typeof this.__value_spectator === 'boolean') {
					return Bt.Internals.spectator;
				} else {
					return this.__value_spectator;
				}
			},
			set: function(this: any, value: boolean): void {
				if(this.__BtInternals === true) return;

				if(typeof value === 'boolean') {
					// console.log(this);

					// this.battleDebug = true;

					this.__value_spectator = Bt.Internals.spectator;
				} else {
					this.__value_spectator = value;
				}
			},
			enumerable: false,
			configurable: true
		});

		/* Object.defineProperty(Object.prototype, 'userName_0', {
			get: function(this: any): any {
				return this.__value_userName_0;
			},
			set: function(this: any, value: string): void {
				if(value.length < 1) return;

				// console.log(this, value);

				setInterval(() => {
					try {
						// console.log(`Updating GS: ${value}`);

						const gearScores: any = Bt.Internals.TankiStore.state.battleUsers.gearScores.map_97q5dv$_0.values.toArray();
						const uid: Nullable<any> = Bt.Internals.TankiStore.state.battleUsers.uids.map_97q5dv$_0.values.toArray().find((entry: any) => entry.value === value) ?? null;
						if(uid === null) return;

						const stats: any = Bt.Internals.TankiStore.state.battleUsers.stats.map_97q5dv$_0.values.toArray().find((entry: any) => entry.key.equals(uid.key)).value;

						const gearScore: number = gearScores.find((entry: any) => entry.key.equals(uid.key)).value;

						let kd: string = (0).toFixed(2);
						if(stats.kills > 0 && stats.deaths > 0) kd = (stats.kills / stats.deaths).toFixed(2);
						else if(stats.kills > 0 && stats.deaths < 1) kd = stats.kills.toFixed(2);

						this.__value_userName_0 = `${value} [GS: ${gearScore}] [KD: ${kd}]`;
					} catch(error) {
						console.error(error);
					}
				}, 5000);

				this.__value_userName_0 = `${value}`;
			},
			enumerable: false,
			configurable: true
		}); */

		Object.defineProperty(Object.prototype, 'axes_0', {
			get: function(this: any): any {
				// console.log('Get', this);
				return this.__value__axes_0;
			},
			set: function(this: any, value: any): void {
				// console.log('Set', this, this.constructor.name, value);

				if(this.constructor.name === 'rh') {

				}

				this.__value__axes_0 = value;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'onTankEntityCreated_jpicnz$', {
			get: function(this: any): any {
				return this.__value__onTankEntityCreated_jpicnz$;
			},
			set: function(this: any, value: any): void {
				this.__value__onTankEntityCreated_jpicnz$__original = value;
				this.__value__onTankEntityCreated_jpicnz$ = function(this: any, t: any, e: any): any {
					// console.log('Call onTankEntityCreated_jpicnz$', this, t, e);

					return this.__value__onTankEntityCreated_jpicnz$__original(t, e);
				};
			},
			enumerable: false,
			configurable: true
		});

		// const response: Response = await fetch('https://cdn.discordapp.com/attachments/731481508447256619/810241922521497610/2021-02-02-22-37-36.png');
		// const blob: Blob = await response.blob();
		// const image: ImageBitmap = await createImageBitmap(blob);

		Object.defineProperty(Object.prototype, 'bitmap_0', {
			get: function(this: any): any {
				return this.__value__bitmap_0;
			},
			set: function(this: any, value: any): void {
				if(value && value.image) {
					// console.log('Set bitmap_0', this, value);

					// value.image = image;
					// value.imageWidth_0 = image.width;
					// value.imageHeight_0 = image.height;
				}

				this.__value__bitmap_0 = value;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'interfaces', {
			get: function(this: any): any {
				return this.__value__simpleName;
			},
			set: function(this: any, value: any): void {
				// console.log('Set simpleName', this, value);

				this.__value__simpleName = value;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'bonusRegionData', {
			get: function(this: any): any {
				return this.__value__bonusRegionData;
			},
			set: function(this: any, value: any): void {
				// console.log('Set bonusRegionData', this, value);

				this.__value__bonusRegionData = value;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, '_bonusMesh_0', {
			get: function(this: any): any {
				return this.__value___bonusMesh_0;
			},
			set: function(this: any, value: any): void {
				if(value && typeof value === 'object') {
					// console.log('Set _bonusMesh_0', this, value);

					if(value.object3d) {
						value.object3d.scaleX = 3;
						value.object3d.scaleY = 3;
						value.object3d.scaleZ = 3;
					}
				}

				this.__value___bonusMesh_0 = value;
			},
			enumerable: false,
			configurable: true
		});

		/* Object.defineProperty(Object.prototype, 'handleCollisionWithOtherTank_mx4ult$', {
			get: function(this: any): any {
				console.log('Get', this);
				return this.__value__handleCollisionWithOtherTank_mx4ult$;
			},
			set: function(this: any, value: any): void {
				console.log('Set', this, value);

				this.__value__handleCollisionWithOtherTank_mx4ult$__original = value;
				this.__value__handleCollisionWithOtherTank_mx4ult$ = function(this: any, t: any): any {
					console.log('Call', this, t);

					// return this.__value__handleCollisionWithOtherTank_mx4ult$__original(t);
				};
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'tankCollisionBox', {
			get: function(this: any): any {
				// console.log('Get 1', this);
				return this.__value__tankCollisionBox;
			},
			set: function(this: any, value: any): void {
				console.log('Set 1', this, value);

				this.__value__tankCollisionBox = value;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'collidesWithOtherTanks', {
			get: function(this: any): any {
				// console.log('Get 2', this);
				return this.__value__collidesWithOtherTanks;
			},
			set: function(this: any, value: any): void {
				console.log('Set 2', this, value);

				this.__value__collidesWithOtherTanks = false;
				// this.__value__collidesWithOtherTanks = value;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'collisionShapes', {
			get: function(this: any): any {
				// console.log('Get 4', this);
				return this.__value__collisionShapes;
			},
			set: function(this: any, value: any): void {
				console.log('Set 4', this, value);

				value.clear();

				this.__value__collisionShapes = value;
			},
			enumerable: false,
			configurable: true
		}); */

		Object.defineProperty(Object.prototype, 'REGION_SIZE_0', {
			get: function(this: any): any {
				return this.__value__REGION_SIZE_0;
			},
			set: function(this: any, value: any): void {
				// console.log('Set REGION_SIZE_0', this, value);

				this.__value__REGION_SIZE_0 = 1000;
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'position', {
			get: function(this: any): any {
				return this.__value__position;
			},
			set: function(this: any, value: any): void {
				if(value && typeof value === 'object' && value.x !== undefined && value.y !== undefined && value.z !== undefined) {
					// console.log('Set position', this, value);

					// value.z = value.z * 2;
				}

				this.__value__position = value;
			},
			enumerable: false,
			configurable: true
		});

		/* Object.defineProperty(Object.prototype, 'force', {
			get: function(this: any): any {
				return this.__value__force
			},
			set: function(this: any, value: any): void {
				console.log('Set force', this, value);

				this.__value__force = 1000000000;
			},
			enumerable: false,
			configurable: true
		}); */

		/* Object.defineProperty(Object.prototype, 'mass', {
			get: function(this: any): any {
				return this.__value__mass;
			},
			set: function(this: any, value: any): void {
				console.log('Set mass', this, value);

				this.__value__mass = value * 0.9;
			},
			enumerable: false,
			configurable: true
		}); */

		/* Object.defineProperty(Object.prototype, 'maxSpeed', {
			get: function(this: any): any {
				return this.__value__maxSpeed;
			},
			set: function(this: any, value: any): void {
				// console.log('Set maxSpeed', this, value);

				if(typeof value === 'number') {
					this.__value__maxSpeed = value * 1.2;
				} else {
					this.__value__maxSpeed = value;
				}
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'acceleration', {
			get: function(this: any): any {
				return this.__value__acceleration;
			},
			set: function(this: any, value: any): void {
				// console.log('Set acceleration', this, value);

				if(typeof value === 'number') {
					this.__value__acceleration = value * 1.2;
				} else {
					this.__value__acceleration = value;
				}
			},
			enumerable: false,
			configurable: true
		}); */

		/* Object.defineProperty(Object.prototype, 'y', {
			get: function(this: any): any {
				return this.__value__y;
			},
			set: function(this: any, value: any): void {
				// console.log('Set y', this, value);

				if(typeof value === 'number') {
					this.__value__y = 1;
				} else {
					this.__value__y = value;
				}
			},
			enumerable: false,
			configurable: true
		}); */

		/* Object.defineProperty(Object.prototype, 'hasBattleResult', {
			get: function(this: any): any {
				const value: any = this.__value__hasBattleResult;

				return value;
			},
			set: function(this: any, value: any): void {
				this.__value__hasBattleResult = value;

				if(value) {
					(Bt.Internals.ReactApp.battleResults as BattleResults).setResults(
						Bt.Internals.TankiStore.state.battleStatistics,
						Bt.Internals.TankiStore.state.battleResults
					);
					(Bt.Internals.ReactApp.battleResults as BattleResults).show();
				} else {
					(Bt.Internals.ReactApp.battleResults as BattleResults).hide();
				}
			},
			enumerable: false,
			configurable: true
		}); */

		Object.defineProperty(Object.prototype, 'HIDE_CHAT_TIMEOUT_0', {
			get: function(this: any): any {
				return this.__value__HIDE_CHAT_TIMEOUT_0;
			},
			set: function(this: any, value: any): void {
				this.__value__HIDE_CHAT_TIMEOUT_0 = value;
				// this.__value__HIDE_CHAT_TIMEOUT_0 = Bt.Internals.Long.fromInt(15e3); // TODO
			},
			enumerable: false,
			configurable: true
		});

		// FEATURE(Assasans): WALLHACK
		{
			// let i = 0;

			function getColor(t: any): number {
				try {
					const components: any[] = t?._entity_f6jh1j$_0?.components_0?.array;

					// i++;
					// if(i % 100) console.log(components);

					const target: boolean = components[0]?.__target;
					const state: string = components[0]?.state?.name;
					const userId: any = components[4]?.userId;
					const userName: string = components.find((component) => component.configuration_0 && component.configuration_0.userName)?.configuration_0?.userName;
					const movement: any = components.find((component) => component.stunned_0 !== undefined && component.state_0 !== undefined);
					const weaponControl: any = components.find((component) => component.weaponMount_vdwdou$_0 !== undefined)?.weaponMount_vdwdou$_0;
					// const effects: any = components.find((component) => component.effects_xivmtt$_0 !== undefined)?.effects_xivmtt$_0;

					// console.log(userName, weaponControl);

					if(state === 'DEAD' || state === 'DEAD_PHANTOM') return 0x000000; // Dead, color: Black
					if(state === 'SEMI_ACTIVE') return 0xffee58; // Phantom, color: Yellow
					// if() return 0xff5722; // Spawn protection, color: Deep Orange

					if(target) return 0x43a047; // Target, color: Green

					if(movement.stunned_0) return 0x006064; // Stunned, color: Dark Cyan
					if(movement.state_0.name === 'MOVING') return 0xe91e63; // Moving, Color: Pink

					return 0xff8a65; // Not moving, color: Light Deep Orange
				} catch(error) {
					console.error(error);

					return 0xffffff; // Error, color: White
				}
			}

			Object.defineProperty(Object.prototype, 'render_ss14n$', {
				get: function(this: any): any {
					return this.__value__render_ss14n$;
				},
				set: function(this: any, value: any): void {
					// console.log('set render_ss14n$', this, value);

					this.__value__render_ss14n$__original = value;
					this.__value__render_ss14n$ = function(this: any, ...args: any[]): any {
						try {
							return this.__value__render_ss14n$__original(...args);
						} catch(error) {
							console.error('pizda', error);
						}
					};
				},
				enumerable: false,
				configurable: true
			});

			Object.defineProperty(Object.prototype, 'updateTransform_2w8zo9$', {
				get: function(this: any): any {
					return this.__value__updateTransform_2w8zo9$;
				},
				set: function(this: any, value: any): void {
					// console.log('set updateTransform_2w8zo9$', this, value);

					this.__value__updateTransform_2w8zo9$__original = value;
					this.__value__updateTransform_2w8zo9$ = function(this: any, t: any,e : any, n: any): any {
						const color: number = getColor(this);

						this.showHighlight_0(color);
						this.hullSkinComponent_p2c7jk$_0.showHighlight_0(color);

						return this.__value__updateTransform_2w8zo9$__original(t, e, n);
					};
				},
				enumerable: false,
				configurable: true
			});

			Object.defineProperty(Object.prototype, 'canShowHighlight_0', {
				get: function(this: any): any {
					return this.__value__canShowHighlight_0;
				},
				set: function(this: any, value: any): void {
					// console.log('set canShowHighlight_0', this, value);

					value = true;

					this.__value__canShowHighlight_0 = value;
				},
				enumerable: false,
				configurable: true
			});

			Object.defineProperty(Object.prototype, 'setHiglightState_0', {
				get: function(this: any): any {
					return this.__value__setHiglightState_0;
				},
				set: function(this: any, value: any): void {
					// console.log('set setHiglightState_0', this, value);

					this.__value__setHiglightState_0__original = value;
					this.__value__setHiglightState_0 = function(this: any, t: any): any {
						// console.log('call', this, t);

						const selfTeam = Bt.Internals.TankiStore.state.battleUsers.teams.get_11rb$(Bt.Internals.TankiStore.state.battleUsers.uids.map_97q5dv$_0.values.toArray().find((entry: any) => entry.key.equals(Bt.Internals.TankiStore.state.user.id)).key);

						const team = this.tankComponent_n0tnrh$_0.team_1h5i78$_0;

						const setHiglight = () => {
							if(team.name === selfTeam.name) {
								return this.__value__setHiglightState_0__original({ isEnabled: true, type: { ordinal: 1 } });
							} else {
								return this.__value__setHiglightState_0__original({ isEnabled: true, type: { ordinal: 0 } });
							}
						}

						if(t.__auto) {
							// return setHiglight();
						}

						if(t.type.ordinal === 0) { // Target
							// console.log('not override', this, t);

							this._entity_f6jh1j$_0.components_0.array[0].__target = t.isEnabled;
							// return this.__value__setHiglightState_0__original(t);
						} else {
							// return setHiglight();
						}

						// return this.__value__setHiglightState_0__original(t);
					};
				},
				enumerable: false,
				configurable: true
			});
		}

		Object.defineProperty(Object.prototype, 'draw_8za3i0$', {
			get: function(this: any): any {
				return this.__value__draw_8za3i0$;
			},
			set: function(this: any, value: any): void {
				this.__value__draw_8za3i0$__original = value;
				this.__value__draw_8za3i0$ = function(this: any, t: any, e: any, n: any, o: any, i: any, r: any, s: any, a: any, c: any): any {
					if(c === null) return;

					return this.__value__draw_8za3i0$__original(t, e, n, o, i, r, s, a, c);
				};
			},
			enumerable: false,
			configurable: true
		});

		Object.defineProperty(Object.prototype, 'generateProgressBarVAO_0', {
			get: function(this: any): any {
				// console.log('TankHud / Get', this, this.__value__generateProgressBarVAO_0);

				return this.__value__generateProgressBarVAO_0;
			},
			set: function(this: any, value: any): void {
				// console.log('TankHud / Set', this, value);

				this.__value__generateProgressBarVAO_0__original = value;
				this.__value__generateProgressBarVAO_0 = function(this: any): any {
					if(Bt.Internals.hideBars) return null;

					return this.__value__generateProgressBarVAO_0__original();
				};
			},
			enumerable: false,
			configurable: true
		});

		KeyboardEvent.prototype._preventDefault = KeyboardEvent.prototype.preventDefault;
		KeyboardEvent.prototype.preventDefault = function(): void {
			// console.log('preventDefault / Call', this);

			if(this.target instanceof HTMLInputElement && this.target.className === 'bt-console-input') {
				return;
			}

			return this._preventDefault();
		};

		/* Object.defineProperty(Object.prototype, 'JuggernautCC', {
			get: function(this: any): any {
				return this.__value__juggernaut;
			},
			set: function(this: any, value: any): void {
				console.log('ARA ARA', this, value);

				this.__value__juggernaut = value;
			},
			enumerable: false,
			configurable: true
		}); */

		// Wasp - t.Long {low_: 886629614, high_: 214}
		// JGR - t.Long {low_: 886629758, high_: 214}
		/* Object.defineProperty(Object.prototype, 'mountedSkin', {
			get: function(this: any): any {
				return this.__value__mountedSkin;
			},
			set: function(this: any, value: any): void {
				// console.log(this, value);

				if(this.value && this.value.getLowBits() === 886629614 && this.value.getHighBits() === 214) {
					this.value.low_ = 886629758;
					this.value.high_ = 214;
				}

				this.__value__mountedSkin = value;
			},
			enumerable: false,
			configurable: true
		}); */

		window.lastReceived = null;
		window.lastSent = null;

		window.events = new EventEmitter();

		WebSocket.prototype._send = WebSocket.prototype.send;
		WebSocket.prototype.send = function send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
			const time: DateTime = DateTime.local();
			window.lastSent = time;
			window.events.emit('send', time);

			console.log('Send', data);

			this._send(data);
		}

		WebSocket.prototype._addEventListener = WebSocket.prototype.addEventListener;

		WebSocket.prototype._onmessage = null;
		WebSocket.prototype._injected = false;

		Object.defineProperty(WebSocket.prototype, 'onmessage', {
			get: function(this: WebSocket): Nullable<(this: WebSocket, event: MessageEvent) => any> {
				return this._onmessage;
			},
			set: function(this: WebSocket, value: (this: WebSocket, event: MessageEvent) => any): void {
				this._onmessage = value;

				if(!this._injected) {
					this._injected = true;

					this._addEventListener('message', (event: MessageEvent) => {
						if(!window.ignorePackets) {
							if(this._onmessage) this._onmessage(event);
						}

						const time: DateTime = DateTime.local();
						window.lastReceived = time;
						window.events.emit('receive', time);

						console.log('Received', event);
					});
				}
			}
		});

		WebSocket.prototype.addEventListener = function addEventListener
			<K extends "close" | "error" | "message" | "open">
			(type: K, listener: (this: WebSocket, event: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void
		{
			if(type === 'message') {
				if(!this._injected) {
					this._injected = true;

					this._addEventListener('message', (event: MessageEvent) => {
						if(!window.ignorePackets) {
							if(this._onmessage) this._onmessage(event);
						}

						const time: DateTime = DateTime.local();
						window.lastReceived = time;
						window.events.emit('receive', time);

						console.log('Received', event);
					});
				}
			}

			this._addEventListener(type, listener, options);
		};

		{
			// FEATURE(Assasans): IGNORE_CHAT_USERS
			const _validateMessage = (context: any, event: any): boolean => {
				// event.message: string - content
				// event.userLabelData: object - author
				// clanTag: string?, hasPremium: boolean, rank: number, teamRelation (name$, ordinal$), uid: string, userId: Long

				const username: string = event.userLabelData.uid;

				if(Runtime.get().ignoreList.some((currentUsername: string) => username === currentUsername)) {
					console.log(`Ignoring message '${event.message}' from '${username}'`);
					return false;
				}

				return true;
			};

			Object.defineProperty(Object.prototype, 'onUserMessage_0', {
				get: function(this: any): any {
					// console.log('Get', this);
					return this.__value__onUserMessage_0;
				},
				set: function(this: any, value: any): void {
					// console.log('Set', this, value);

					this.__value__onUserMessage_0__original = value;
					this.__value__onUserMessage_0 = function(this: any, e: any): any {
						// console.log('Call', this, e);

						if(!_validateMessage(this, e)) {
							return;
						}

						return this.__value__onUserMessage_0__original(e);
					};
				},
				enumerable: false,
				configurable: true
			});

			Object.defineProperty(Object.prototype, 'onTeamMessage_0', {
				get: function(this: any): any {
					return this.__value__onTeamMessage_0;
				},
				set: function(this: any, value: any): void {
					this.__value__onTeamMessage_0__original = value;
					this.__value__onTeamMessage_0 = function(this: any, e: any): any {
						// console.log('Call', this, e);

						if(!_validateMessage(this, e)) {
							return;
						}

						return this.__value__onTeamMessage_0__original(e);
					};
				},
				enumerable: false,
				configurable: true
			});
		}

		Object.defineProperty(Object.prototype, 'getMessageHTML_0', {
			get: function(this: any): any {
				return this.__value_getMessageHTML_0;
			},
			set: function(this: any, value: any): void {
				this.__value_getMessageHTML_0__original = value;
				this.__value_getMessageHTML_0 = function(this: any, t: any): string {
					// console.log(this, t);

					// FEATURE(Assasans): SCREENSHOT_ON_GOLD
					if(t.constructor.name === 'tr' && t.content && t.content.name$ === 'BATTLE_GOLD_TAKEN') {
						// Replace with `true` to enable
						const SCREENSHOT_ENABLED: boolean = false;

						// Replace with `true` to make screenshot on every player taking gold box
						const SCREENSHOT_ON_ANY_PLAYER: boolean = false;

						if(SCREENSHOT_ENABLED) {
							if(SCREENSHOT_ON_ANY_PLAYER ? true : t.userUid === Bt.Internals.TankiStore.state.user.uid) {
								(async () => {
									console.log(`${t.userUid} taken gold box!`);

									const image: NativeImage = await remote.getCurrentWebContents().capturePage();
									const png: Buffer = image.toPNG();

									const dir: string = path.join(Runtime.userData, 'screenshots');

									if(!await Bt.Helpers.FS.exists(dir)) {
										await fs.mkdir(dir);
									}

									const filename: string = `screenshot_gold_${DateTime.local().toFormat('dd-MM-yyyy_HH-mm-ss')}.png`;
									const file: string = path.join(dir, filename);

									await fs.writeFile(file, png, {
										encoding: null
									});

									// Lazy load
									(Bt.Api.PluginAPI.get('notification-api')!.api as import('./api/notification/index').NotificationAPI).create(new (await import('./api/notification/index')).Notification({
										title: 'Скриншот создан',
										message: `${filename}`,

										icon: image.toDataURL(),
										iconBig: true,

										duration: 5000
									}));
								})();
							}
						}
					}

					return this.__value_getMessageHTML_0__original(t);
				};
			},
			enumerable: false,
			configurable: true
		});

		/* Object.defineProperty(Object.prototype, 'url_hxw8ai$_0', {
			get: function(this: any): string {
				return this.__value_url_hxw8ai$_0;
			},
			set: function(this: any, value: string): void {
				console.log(this, value);

				if(value.includes('tankionline.com')) {
					this.__value_url_hxw8ai$_0 = value;
				} else {
					this.__value_url_hxw8ai$_0 = 'ws://localhost:7772/';
				}
			},
			enumerable: false,
			configurable: true
		}); */
	}

	Object.defineProperty(Object.prototype, 'state', {
		get: function(this: any): any {
			return this.__value_state;
		},
		set: function(this: any, value: any): void {
			if(this.state && this.subscribers && this.dispatchFunction) {
				Bt.Internals.TankiStore = this;
				Bt.Internals.Long = this.state.user.id.constructor;
			}

			this.__value_state = value;
		},
		enumerable: false,
		configurable: true
	});

	function getContext<TContext = unknown, TValue = unknown>(property: string, validator?: (context: TContext, value: TValue) => boolean): Promise<TContext> {
		const valueProperty: string = `__value_${property}`;

		return new Bluebird((resolve, reject) => {
			Object.defineProperty(Object.prototype, property, {
				get: function(this: TContext): TValue {
					return (this as any)[valueProperty];
				},
				set: function(this: TContext, value: TValue): void {
					(this as any)[valueProperty] = value;

					if(!validator || validator(this, value)) {
						return resolve(this);
					}
				},
				enumerable: false,
				configurable: true
			});
		});
	}


	// WebGL contexts leaking (fixed by developers on 25.09.2020)
	// Source: https://ru.tankiforum.com/topic/278577

	// HTMLCanvasElement.prototype.getContext_ = HTMLCanvasElement.prototype.getContext;
	// var storedContexts = [];
	// HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
	// 	var newContext = this.getContext_(contextType, contextAttributes);
	// 	if(contextType == "webgl" || contextType == "webgl2") {
	// 		newContext.numOfCalls = 0; newContext.lastNumOfCalls = 0;
	// 		newContext.useProgram = function(program) {
	// 			this.numOfCalls++;
	// 			return this.__proto__.useProgram.call(this, program);
	// 		};

	// 		storedContexts = storedContexts.filter(function(context) {
	// 			if(context.numOfCalls == context.lastNumOfCalls) {
	// 				if(!context.isContextLost()) {
	// 					context.getExtension("WEBGL_lose_context").loseContext();
	// 				}
	// 				return false;
	// 			} else {
	// 				context.lastNumOfCalls = context.numOfCalls;
	// 				return true;
	// 			}
	// 		});

	// 		storedContexts.push(newContext);
	// 	}

	// 	return newContext;
	// };

	const preload = await import('./preload');
}

interface ProxyObject<T = unknown> {
	__value?: T;
}

interface StateObject {
	state?: unknown;
	subscribers: unknown;

	dispatchFunction: Function;
}

interface ComponentObject {
	render?: () => React.ReactNode;
}

window.__earlyInit__ = __earlyInit__;

__earlyInit__();
