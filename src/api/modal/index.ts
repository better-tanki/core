/// <reference path="../../../plugins/plugins.d.ts" />

import { Collection } from '@assasans/storage';

import { Nullable } from '../../helper/type';

interface TitleInfo {
	icon?: Nullable<string>;
	text: string;
}

export enum ButtonType {
	OK, Yes, No
}

export interface ModalInfo {
	title: TitleInfo;
	message: string;
	
	buttons: ButtonType[];
}

export class Modal {
	public id: number;
	public info: ModalInfo;

	public buttons: JQuery;

	public constructor(id: number, info: ModalInfo, buttons: JQuery) {
		this.id = id;
		this.info = info;

		this.buttons = buttons;
	}
}

export interface ModalAPI {
	create: (info: ModalInfo) => Modal;
}


export default class extends Bt.Api.Plugin<ModalAPI> {
	public api: ModalAPI;

	private notifications: Collection<number, Modal>;

	public constructor() {
		super({
			id: 'modal-api',
			name: 'Modal API',
			description: null,
			version: '1.0.0',
			author: 'Assasans'
		});

		this.api = {
			create: (info: ModalInfo): Modal => {
				throw new Error('Plugin is not loaded');
			}
		};

		this.notifications = new Collection<number, Modal>();
	}

	public async load(): Promise<void> {
		const $ = await import('jquery');

		Bt.Api.ResourceLoader.localCSS('../static/api/modal/css/modal.css', true);

		$('body').prepend($('<div id="bt-modal__container"></div>'));

		$('div#bt-modal__container').css('display', 'none');
		
		this.api = {
			create: (info: ModalInfo): Modal => {
				const {
					title, message, buttons
				}: ModalInfo = info;
	
				const container = $('div#bt-modal__container');

				container.css('display', 'flex');
	
				const id: number = Math.floor(Math.random() * 0xFFFFFFFF);

				const element = $(`
<div class="bt-modal">
	<div class="bt-modal__header">
		<img class="bt-modal__icon">
		<div class="bt-modal__title">${title.text}</div>
	</div>
	<div class="bt-modal__content">
		<div class="bt-modal__message">${message}</div>
	</div>
	<div class="bt-modal__buttons"></div>
</div>
				`);

				const iconElement = element.children('div.bt-modal__header').children('img.bt-modal__icon');
				const titleElement = element.children('div.bt-modal__header').children('div.bt-modal__title');

				const messageElement = element.children('div.bt-modal__content').children('div.bt-modal__message');
				
				const buttonsElement = element.children('div.bt-modal__buttons');

				buttons.forEach((button: ButtonType) => {
					const buttonElement = $('<button class="bt-modal__button"></button>');
					switch(button) {
						case ButtonType.OK: {
							buttonElement.addClass('bt-modal__button-ok');
							buttonElement.text('OK');
							break;
						}

						case ButtonType.Yes: {
							buttonElement.addClass('bt-modal__button-yes');
							buttonElement.text('Да');
							break;
						}

						case ButtonType.No: {
							buttonElement.addClass('bt-modal__button-no');
							buttonElement.text('Нет');
							break;
						}
					}

					buttonsElement.append(buttonElement);
				});
	
				if(title.icon === null || title.icon === undefined) {
					iconElement.attr('src', null);
					iconElement.css('display', 'none');
				} else {
					iconElement.attr('src', title.icon);
					iconElement.css('display', 'block');
				}
				
				element.attr('data-modal-id', id);
	
				container.append(element);

				const modal: Modal = new Modal(
					id,
					info,
					buttonsElement.children('button.bt-modal__button')
				);
	
				return modal;
			}
		};
	}

	public async start(): Promise<void> {
	}
}
