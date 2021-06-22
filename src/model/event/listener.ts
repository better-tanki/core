export type EventHandler = (...args: unknown[]) => unknown;

export interface EventListenerInfo<T extends string = string> {
	node: Node;

	type: T;
	handler: EventHandler;
}

export class EventListener<T extends string = string> {
	public node: Node;

	public type: T;
	public handler: EventHandler;

	public constructor(info: EventListenerInfo<T>) {
		const {
			node,
			type, handler
		}: EventListenerInfo<T> = info;

		this.node = node;
		
		this.type = type;
		this.handler = handler;
	}
}
