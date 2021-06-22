// Tried to implement packet replay system, unsuccessfully

interface Packet {
	instance: WebSocket;
	id: number;
	url: string;
	event: MessageEvent;
	data: any;
	handler: (this: WebSocket, event: MessageEvent) => any;
	offset: number;
}

const packets: List<Packet> = new List();

let capturing: boolean = true;
let replaying: boolean = false;

let instance: number = 0;

global.packets = packets;

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
			const id: number = instance++;

			const start: DateTime = DateTime.local();

			this._addEventListener('message', (event: MessageEvent) => {
				if(this._onmessage) this._onmessage(event);

				if(capturing) {
					const data: any = event.data;

					const packet: Packet = {
						instance: this,
						id: id,
						url: this.url,
						event: event,
						data: data,
						handler: this._onmessage,
						offset: DateTime.local().diff(start).shiftTo('milliseconds').milliseconds
					};

					packets.add(packet);

					console.log(`[${packet.id}/${packet.url}] Message`, packet.data);
				}
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
			const id: number = instance++;

			const start: DateTime = DateTime.local();

			this._addEventListener('message', (event: MessageEvent) => {
				if(this._onmessage) this._onmessage(event);

				if(capturing) {
					const data: any = event.data;

					const packet: Packet = {
						instance: this,
						id: id,
						url: this.url,
						event: event,
						data: data,
						handler: listener as (this: WebSocket, event: MessageEvent) => void,
						offset: DateTime.local().diff(start).shiftTo('milliseconds').milliseconds
					};

					packets.add(packet);

					console.log(`[Capture/${packet.id}] Message`, packet.data);
				}
			});
		}
	}

	this._addEventListener(type, listener, options);
};

WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
	if(!replaying) {
		this._send(data);
	} else {
		console.log(`[Replay/Send] Ignoring sending packet (replay mode)`, data);
	}
}

WebSocket.prototype._close = WebSocket.prototype.close;
WebSocket.prototype.close = function close(code?: number | undefined, reason?: string | undefined): void {
	if(!replaying) {
		this._close(code, reason);
	} else {
		console.log(`[Replay/Close] Ignoring closing connection (replay mode)`);
	}
}

const OldWebSocket = WebSocket;

const PatchedWebSocket: typeof WebSocket = function WebSocket(this: WebSocket, url: string, protocols?: string | string[] | undefined): WebSocket {
	if(replaying) {
		console.log(`[Replay/Open] Ignoring opening connection (replay mode): ${url}`);

		const emitter: EventEmitter = new EventEmitter();

		const instance: WebSocket = OldWebSocket.prototype;

		this._addEventListener = () => emitter.addListener;
		this.removeEventListener = () => emitter.removeListener;

		this.addEventListener = instance.addEventListener;
		this.binaryType = 'arraybuffer';
		this.bufferedAmount = 0;
		this._close = instance._close;
		this.close = instance.close;
		this.dispatchEvent = instance.dispatchEvent;
		// this.extensions = instance.extensions;
		// this.onclose = instance.onclose;
		// this.onerror = instance.onerror;
		// this.onmessage = instance.onmessage;
		// this.onopen = instance.onopen;
		this.protocol = 'wss';
		this.readyState = OldWebSocket.OPEN;
		this.removeEventListener = instance.removeEventListener;
		this._send = instance._send;
		this.send = instance.send;
		this.url = url;

		this.addEventListener('open', (event) => this.onopen?.(event));
		this.addEventListener('close', (event) => this.onclose?.(event));
		this.addEventListener('error', (event) => this.onerror?.(event));
		this.addEventListener('message', (event) => this.onmessage?.(event));
	} else {
		console.log(`[PatchedWebSocket] Creating new connection: ${url}`);

		return new OldWebSocket(url, protocols);
	}
}

PatchedWebSocket.CLOSED = OldWebSocket.CLOSED;
PatchedWebSocket.CLOSING = OldWebSocket.CLOSING;
PatchedWebSocket.CONNECTING = OldWebSocket.CONNECTING;
PatchedWebSocket.OPEN = OldWebSocket.OPEN;

WebSocket = PatchedWebSocket;

type GroupedPackets = {
	[id: number]: Packet[];
};

global.capture = async function capture(): Promise<void> {
	capturing = true;
	replaying = false;
}

global.replay = async function replay(): Promise<void> {
	capturing = false;
	replaying = true;

	const groups: GroupedPackets = _.groupBy(packets.array(), (packet: Packet) => packet.id);
	for(const [_id, packets] of Object.entries(groups)) {
		const id: number = Number(_id);

		(async () => {
			console.log(`[Replay] Replaying group ${id}: ${packets.length} packets`);

			packets.forEach(async (packet: Packet, index: number) => {
				await Bluebird.delay(packet.offset);

				console.log(`[Replay/${id}] Replaying packet ${index}`, packet.data);

				packet.handler.call(packet.instance, packet.event);
			});
		})();
	}
}


/// DELAY


window.sockets = [];

window.flushPackets = function flushPackets(): void {
	window.sockets.forEach((socket: WebSocket) => {
		if(socket._packets) {
			socket._packets.forEach((data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) => {
				console.log(`Sending delayed packet`, data);
				socket.send(data);
			});
			socket._packets = [];
		}
	});
}



WebSocket.prototype._send = WebSocket.prototype.send;
WebSocket.prototype.send = function send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void {
	if(!window.sockets.some((socket: WebSocket) => socket === this)) window.sockets.push(this);

	if(window.capturePackets) {
		console.log(`Captured packet`, data);

		global.capturedPackets.push(data);
	}

	if(window.delayPackets) {
		console.log(`Delaying packet`, data);

		if(!this._packets) this._packets = [];
		this._packets.push(data);

		global.capturedPackets.forEach((packet) => {
			console.log(`Sending captured packet`, packet);

			this._send(packet);
		});
	} else {
		this._send(data);
	}
}
