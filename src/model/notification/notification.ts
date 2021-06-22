import { Duration } from 'luxon';
import { ReactNode } from 'react';

import { Nullable } from '../../helper/type';

export enum NotificationLevel {
	Debug,
	Info,
	Warn,
	Error,
	Fatal
}

export interface NotificationTitleInfo {
	icon: Nullable<ReactNode>;
	text: Nullable<ReactNode>;
}

export class NotificationTitle {
	public icon: Nullable<ReactNode>;
	public text: Nullable<ReactNode>;

	public constructor(info: NotificationTitle | NotificationTitleInfo) {
		this.icon = info.icon;
		this.text = info.text;
	}
}

export interface NotificationInfo {
	id: number;

	title: Nullable<NotificationTitle | NotificationTitleInfo>;

	description: Nullable<ReactNode>;

	duration: number | Duration;

	level: NotificationLevel;

	hidden: boolean;
}

export class Notification {
	public id: number;

	public title: Nullable<NotificationTitle>;

	public description: Nullable<ReactNode>;

	public duration: Duration;

	public level: NotificationLevel;

	public hidden: boolean;

	public slideOut: boolean;

	public constructor(info: Notification | NotificationInfo) {
		this.id = info.id;

		this.title = info.title !== null ? info.title instanceof NotificationTitle ? info.title : new NotificationTitle(info.title) : null;

		this.description = info.description;

		this.level = info.level;

		this.duration = info.duration instanceof Duration ? info.duration : Duration.fromMillis(info.duration);

		this.hidden = info.hidden;

		this.slideOut = false;
	}
}
