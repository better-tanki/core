/// <reference path="../../../plugins/plugins.d.ts" />

import * as ReactDOM from 'react-dom';
import * as Bluebird from 'bluebird';
import * as React from 'react';

import { Component, ReactNode } from 'react';
import { Collection } from '@assasans/storage';

import { Nullable, HasInfo } from '../../helper/type';

export interface NotificationInfo {
	title?: Nullable<string>;
	message?: Nullable<string>;

	icon?: Nullable<string>;
	iconBig?: boolean;
	
	duration: number;
}

export class Notification implements HasInfo<NotificationInfo> {
	public title: Nullable<string>;
	public message: Nullable<string>;

	public icon: Nullable<string>;
	public iconBig: boolean;
	
	public duration: number;

	public constructor(info: NotificationInfo) {
		const {
			title, message,
			icon, iconBig,
			duration
		}: NotificationInfo = info;

		this.title = title ?? null;
		this.message = message ?? null;

		this.icon = icon ?? null;
		this.iconBig = iconBig ?? false;

		this.duration = duration;
	}

	public info(): NotificationInfo {
		return {
			title: this.title,
			message: this.message,

			icon: this.icon,

			duration: this.duration
		};
	}
}

export interface NotificationAPI {
	create: (notification: Notification) => number;
	edit: (id: number, notification: Notification) => boolean;
	delete: (id: number) => boolean;
}

export interface NotificationsProps {
	
}

export interface NotificationsState {
	notifications: Notification[];
}

class NotificationReact extends Component<NotificationsProps, NotificationsState> {
	public constructor(props: {}) {
		super(props);

		this.state = {
			notifications: []
		};
	}

	public componentDidMount(): void {
	}

	public addNotification(notification: Notification): void {
		this.setState({
			notifications: [
				...this.state.notifications,
				notification
			]
		});
	}

	public editNotification(id: number, notification: Notification): void {
		const item: Nullable<Notification> = this.state.notifications[id];
		if(item) {
			this.setState({
				notifications: this.state.notifications.map((currentNotification: Notification, index: number): Notification => {
					if(index !== id) return notification;
					return notification;
				})
			});
		}
	}

	public render(): ReactNode {
		// return null;
		return (
			<div className="btp-notifications">
				{this.state.notifications.map((notification: Notification, index: number) => (
					<NotificationItem
						key={index}
						notification={notification} />
				))}

				{/* <NotificationItem
					notification={new Notification({
						message: 'Message example',
						title: 'Title example',

						icon: 'https://cdn.discordapp.com/emojis/748995609964445726.png',

						duration: 5000
					})} /> */}

				{/* <NotificationItem
					title="Title example"
					message="Message example"
					icon="https://cdn.discordapp.com/emojis/748995609964445726.png"
					duration={5000} />

				<NotificationItem
					title="Title example"
					message="No icon"
					icon={null}
					duration={5000} />

				<NotificationItem
					title="No message"
					message={null}
					icon={null}
					duration={5000} />

				<NotificationItem
					title={null}
					message="No title"
					icon={null}
					duration={5000} />

				<NotificationItem
					title={null}
					message={null}
					icon="https://cdn.discordapp.com/emojis/748995609964445726.png"
					duration={5000} /> */}
			</div>
		);
	}
}

export default class extends Bt.Api.Plugin<NotificationAPI> {
	public api: NotificationAPI;

	public component: Nullable<NotificationReact>;

	private notifications: Collection<number, Notification>;

	public constructor() {
		super({
			id: 'notification-api',
			name: 'Notification API',
			description: null,
			version: '1.0.0',
			author: 'Assasans'
		});

		this.api = {
			create: (): number => {
				throw new Error('Plugin is not loaded');
			},
			edit: (): boolean => {
				throw new Error('Plugin is not loaded');
			},
			delete: (): boolean => {
				throw new Error('Plugin is not loaded');
			}
		};

		this.component = null;

		this.notifications = new Collection<number, Notification>();
	}

	/**
	 * TODO: Config:
		{
			"errors": {
				"sync": true,
				"promise": true,
				"critical": true
			}
		}
	 */
	private async getConfig() {
		const path = await import('path');
		const fs = await import('promise-fs');

		return JSON.parse(await fs.readFile(path.join(__dirname, '../config.json'), {
			encoding: 'utf8'
		}));
	}

	public async load(): Promise<void> {
		const $ = await import('jquery');

		this.component = ReactDOM.render(
			React.createElement(NotificationReact),
			Bt.Api.PluginAPI.allocateUI(this)
		);

		Bt.Api.ResourceLoader.localCSS('../static/api/notification/css/notification.css', true);

		$('body').prepend($('<div id="bt-notifications"></div>'));

		this.api = {
			create: (notification: Notification): number => {
				this.component!.addNotification(notification);
				return -1;
			},
			edit: (id: number, notification: Notification): boolean => {
				 this.component!.editNotification(id, notification);
				return true;
			},
			delete: (id: number): boolean => {
				return false;
			}
		};
	}

	public async start(): Promise<void> {
		const config = await this.getConfig();

		if(config.errors.sync) {
			window.addEventListener('error', (event) => {
				const error = event.error;
				if(!error.name || !error.message) return;
				
				this.api.create(new Notification({
					title: `Ошибка: ${error.name}`,
					message: error.message,
					duration: 10000
				}));
			});
		}

		if(config.errors.promise) {
			window.addEventListener('unhandledrejection', (event) => {
				event.promise.catch((error) => {
					if(!error.name || !error.message) return;

					this.api.create(new Notification({
						title: `Асинхронная ошибка: ${error.name}`,
						message: error.message,
						duration: 10000
					}));
				});
			});
		}

		if(config.errors.critical) {
			const instance: this = this;

			const _error = console.error;
			console.error = function error(...args: any[]) {
				if(args[0] === 'ERROR' || args[0] === 'FATAL') {
					const error = args[3];

					if(error && error.name) {
						const key: string | undefined = Object.getOwnPropertyNames(error).find((name) => name.startsWith('message'));
						if(key) {
							const message: string = error[key];
							(instance.api as NotificationAPI).create(new Notification({
								title: `Критическая ошибка: ${error.name}`,
								message: message,
								duration: 10000
							}));
						}
					}
				}
				_error.call(this, ...args);
			}
		}

		/*this.api.create({
			title: 'Notification API',
			message: 'Плагин загружен',
			duration: 3000
		});*/
	}
}

interface NotificationProps {
	notification: Notification;
	callback?: (component: NotificationItem) => void
}

interface NotificationState {
	notification: Notification;

	hiding: boolean;
	deleted: boolean;
}

class NotificationItem extends Component<NotificationProps, NotificationState> {
	private hidePromise: Nullable<Bluebird<void>>;
	private deletePromise: Nullable<Bluebird<void>>;

	public constructor(props: NotificationProps) {
		super(props);

		this.state = {
			notification: this.props.notification,

			hiding: false,
			deleted: false
		};

		this.hidePromise = null;
		this.deletePromise = null;
	}
	
	public componentDidMount(): void {
		this.initTimeout();
		if(this.props.callback) this.props.callback(this);
	}

	public componentWillUnmount(): void {
		if(this.hidePromise !== null) {
			this.hidePromise.cancel();
			this.hidePromise = null;
		}

		if(this.deletePromise !== null) {
			this.deletePromise.cancel();
			this.deletePromise = null;
		}
	}

	private initTimeout(): void {
		this.hidePromise = Bluebird.delay(this.state.notification.duration).then(() => {
			this.setState({ hiding: true });
			this.deletePromise = Bluebird.delay(750).then(() => this.setState({ deleted: true }));
		});
	}

	public edit(notification: Notification): void {
		if(notification.duration !== this.state.notification.duration) {
			if(this.hidePromise !== null) {
				this.hidePromise.cancel();
			}

			this.initTimeout();
		}

		this.setState({
			notification: notification
		});
	}

	public render(): ReactNode {
		const {
			notification,
			hiding, deleted
		}: NotificationState = this.state;

		const {
			title, message,
			icon, iconBig
		}: Notification = notification;

		if(deleted) return null;

		if(iconBig) {
			return (
				<div className={`btp-notification btp-notification--icon-big${hiding ? ' btp-notification--hide' : ''}`}>					
					<div className="btp-notification__content">
						{title !== null && title !== undefined ? (
							<div className="btp-notification__title">{title}</div>
						) : null}

						{message !== null && message !== undefined ? (
							<div className="btp-notification__message">{message}</div>
						) : null}
					</div>

					{icon !== null && icon !== undefined ? (
						<img className="btp-notification__icon-big" src={icon} />
					) : null}
				</div>
			);
		} else {
			return (
				<div className={`btp-notification${hiding ? ' btp-notification--hide' : ''}`}>
					{icon !== null && icon !== undefined ? (
						<img className="btp-notification__icon" src={icon} />
					) : null}
					
					<div className="btp-notification__content">
						{title !== null && title !== undefined ? (
							<div className="btp-notification__title">{title}</div>
						) : null}

						{message !== null && message !== undefined ? (
							<div className="btp-notification__message">{message}</div>
						) : null}
					</div>
				</div>
			);
		}
	}
}
