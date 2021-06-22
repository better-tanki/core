import * as React from 'react';
import * as Bluebird from 'bluebird';

import { Component, ReactNode } from 'react';

export interface SettingsProps {

}

export interface SettingsState {
	fadeIn: boolean;

	fadeOut: boolean;

	_visible: boolean;
	visible: boolean;
}

export class Settings extends Component<SettingsProps, SettingsState> {
	public constructor(props: SettingsProps) {
		super(props);

		this.state = {
			fadeIn: false,

			fadeOut: false,

			_visible: false,
			visible: false
		};

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.onKeyDownGlobal = this.onKeyDownGlobal.bind(this);
	}

	public async componentDidMount(): Promise<void> {
		// this.attachEvents();
	}

	public async componentWillUnmount(): Promise<void> {
		this.detachEvents();
	}

	private attachEvents(): void {
		document.body.addEventListener('keydown', this.onKeyDownGlobal);
	}

	private detachEvents(): void {
		document.body.removeEventListener('keydown', this.onKeyDownGlobal);
	}

	public async show(): Promise<void> {
		if(this.state._visible) return;
		
		this.attachEvents();

		this.setState({
			_visible: true
		});

		this.setState({
			fadeIn: true,

			visible: true
		});

		await Bluebird.delay(500);

		this.setState({
			fadeIn: false
		});
	}

	public async hide(): Promise<void> {
		if(!this.state._visible) return;

		this.detachEvents();

		this.setState({
			_visible: false
		});

		this.setState({
			fadeOut: true
		});

		await Bluebird.delay(500);

		this.setState({
			fadeOut: false,
			visible: false
		});
	}

	private async onKeyDownGlobal(event: KeyboardEvent): Promise<void> {
		console.log(event.key);
		if(event.key === 'Escape') {
			event.stopPropagation();

			this.hide();
		}
	}

	public render(): ReactNode {
		if(!this.state.visible) return null;

		return (
			<div
				className={`bt-settings${this.state.fadeIn ? ' bt-settings--fade-in' : ''}${this.state.fadeOut ? ' bt-settings--fade-out' : ''}`}
				style={{
					color: '#ffffff'
				}}
			>
				Under development: press Escape
			</div>
		);
	}
}
