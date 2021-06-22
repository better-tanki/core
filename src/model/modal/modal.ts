import { ReactNode } from 'react';

import { Nullable } from '../../helper/type';

export enum ModalLevel {
	Debug,
	Info,
	Warn,
	Error,
	Fatal
}

export interface ModalTitleInfo {
	icon: Nullable<ReactNode>;
	text: Nullable<ReactNode>;
}

export class ModalTitle {
	public icon: Nullable<ReactNode>;
	public text: Nullable<ReactNode>;

	public constructor(info: ModalTitle | ModalTitleInfo) {
		this.icon = info.icon;
		this.text = info.text;
	}
}

export interface ModalInfo {
	id: number;

	title: Nullable<ModalTitle | ModalTitleInfo>;

	description: Nullable<ReactNode>;

	level: ModalLevel;
}

export class Modal {
	public id: number;

	public title: Nullable<ModalTitle>;

	public description: Nullable<ReactNode>;

	public level: ModalLevel;

	public fadeIn: boolean;
	public fadeOut: boolean;

	public constructor(info: Modal | ModalInfo) {
		this.id = info.id;

		this.title = info.title !== null ? info.title instanceof ModalTitle ? info.title : new ModalTitle(info.title) : null;

		this.description = info.description;

		this.level = info.level;

		this.fadeIn = false;
		this.fadeOut = false;
	}
}
