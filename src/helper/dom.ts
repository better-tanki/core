import { List } from '@assasans/storage';

import { EventListener } from '../model/event/listener';

export class DOMHelper {
	private constructor() {}

	public static copyEvents(source: HTMLElement, target: HTMLElement, events?: string[]): void {
		const allListeners: List<EventListener> = source.getEventListeners();
		const listeners: List<EventListener> = events !== undefined ? allListeners.filter((listener: EventListener) => events.includes(listener.type)) : allListeners;

		listeners.each((listener: EventListener) => {
			target.addEventListener(listener.type, listener.handler);
		});
	}
}
