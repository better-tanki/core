import * as rp from 'request-promise';
import * as Bluebird from 'bluebird';
import * as minimist from 'minimist';
import * as WebSocket from 'ws';
import * as chalk from 'chalk';
import * as Path from 'path';
import * as _ from 'lodash';

import {
	BrowserWindow, OnBeforeRequestListenerDetails, Response,
	app, protocol, session
} from 'electron';

import { Log } from './log';
import { Nullable } from './helper/type';

Log.preinit.info('BetterTanki starting...');
const args = minimist(
	process.argv.slice(2),
	{
		boolean: [
			'fallback'
		]
	}
);

// Password encryption for account switching
/* (async () => {
	const plaintext: Buffer = Buffer.from('sus');
	console.log(plaintext);
	console.log(plaintext.toString());
	console.log();

	const key: Buffer = await AesHelper.generateKey(Buffer.from('better-tanki-core'));
	console.log(key);
	console.log(key.toString());
	console.log();

	const encrypted: Buffer = await AesHelper.encrypt(plaintext, key);
	console.log(encrypted);
	console.log(encrypted.toString());
	console.log(encrypted.toString('base64'));
	console.log();

	const decrypted: Buffer = await AesHelper.decrypt(encrypted, key);
	console.log(decrypted);
	console.log(decrypted.toString());
	console.log();
})(); */

async function createWindow() {
  const window: BrowserWindow = new BrowserWindow({
		width: 1024,
		height: 1024,
		show: false,
		fullscreenable: true,
		frame: true,
		backgroundColor: '#565769',
    webPreferences: {
			preload: args.fallback === false ? Path.join(__dirname, 'early-init.js') : undefined,
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false,
			contextIsolation: false,
			allowRunningInsecureContent: true,
			sandbox: false
		}
	});

	session.defaultSession.webRequest.onBeforeRequest({
		urls: [
			'*://*/*'
		]
	}, (details: OnBeforeRequestListenerDetails, callback: (response: Response) => void) => {
		const url: string = details.url;

		if(url.includes('sentry')) return callback({ cancel: true });

		return callback({ cancel: false });
	});

	window.loadFile(Path.join(__dirname, '../static/html/void.html'));

	// await disableCSP(9222);

	window.removeMenu();
	window.maximize();
	window.show();

	window.webContents.on('did-frame-finish-load', () => {
		window.webContents.openDevTools();
	});

	window.on('enter-html-full-screen', () => window.setFullScreen(true));
	window.on('leave-html-full-screen', () => window.setFullScreen(false));
}

protocol.registerSchemesAsPrivileged([
	{
		scheme: 'http',
		privileges: {
			corsEnabled: false,
			bypassCSP: true
		}
	},
	{
		scheme: 'https',
		privileges: {
			corsEnabled: false,
			bypassCSP: true
		}
	},
	{
		scheme: 'file',
		privileges: {
			corsEnabled: false,
			bypassCSP: true
		}
	},
	{
		scheme: 'data',
		privileges: {
			corsEnabled: false,
			bypassCSP: true
		}
	},
	{
		scheme: 'ws',
		privileges: {
			corsEnabled: false,
			bypassCSP: true
		}
	},
	{
		scheme: 'wss',
		privileges: {
			corsEnabled: false,
			bypassCSP: true
		}
	}
]);

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
				// Log.cdp.error(error);
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

async function disableCSP(port: number): Promise<void> {
	const pages: Page[] = await rp(`http://localhost:${port}/json/list`, {
		json: true
	});

	const page: Nullable<Page> = pages.find((page: Page) => !page.url.startsWith('devtools://')) ?? null;
	if(!page) throw new Error('Page not found');

	return new Bluebird(async (resolve, reject) => {
		const socket: WebSocket = new WebSocket(page.id);

		socket.on('open', () => {
			socket.send(JSON.stringify({
				id: 0,
				method: 'Page.setBypassCSP',
				params: {
					enabled: true
				}
			}));
		});

		socket.on('message', (data: WebSocket.Data) => {
			const packet: Packet = JSON.parse(data.toString());

			if('error' in packet) {
				socket.close();
				return reject(new Error(`CDP Error: ${packet.error.code}: ${packet.error.message}`))
			}

			socket.close();
			return resolve();
		});

		socket.on('error', (error: Error) => {
			socket.close();
			return reject(error);
		});
	});
}

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

app.commandLine.appendSwitch('remote-debugging-port', '9222');
app.commandLine.appendSwitch('webgl-msaa-sample-count', '2');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-oop-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-accelerated-mjpeg-decod');
app.commandLine.appendSwitch('enable-accelerated-video');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');
// app.commandLine.appendSwitch('limit-fps', '5');

app.on('ready', async () => {
	protocol.registerFileProtocol('file', (request: Electron.ProtocolRequest, callback) => {
		const pathname: string = request.url.replace('file://', '');
		return callback(pathname);
	});

  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit();
});
