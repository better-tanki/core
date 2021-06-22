import * as Classname from 'classnames';
import * as Bluebird from 'bluebird';
import * as React from 'react';
import * as _ from 'lodash';

import { Component, ReactNode } from 'react';

import { PluginFlags } from '../../model/plugin/plugin';

import { PluginTitleView } from './title';
import { SwitchView } from '../control/switch/switch';
import { SwitchValueView } from '../control/switch/switch-value';

export interface PluginProps {
	id: number;

	name: ReactNode;
	author: ReactNode;
	version: ReactNode;
	description: ReactNode;

	flags: PluginFlags;

	onClick?: (component: PluginView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface PluginState {
	hover: boolean;
	selected: boolean;
}

export class PluginView extends Component<PluginProps, PluginState> {
	public constructor(props: PluginProps) {
		super(props);

		this.state = {
			hover: false,
			selected: false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	public get hover(): boolean {
		return this.state.hover;
	}

	public set hover(hover: boolean) {
		this.setState({ hover: hover });
	}

	public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public setSelected(selected: boolean): void {
		this.setState({
			selected: selected
		});
	}

	public render(): ReactNode {
		const {
			name,
			author,
			version,
			description,

			flags
		}: PluginProps = this.props;


		return (
			<div
				className={Classname('plugin', {
					'plugin-selected': this.state.selected
				})}
				onClick={this.onClick}
			>
				<div className="plugin-icon-container">
					<img className="plugin-icon" src="https://cdn.discordapp.com/emojis/811327873649737759.png" />
				</div>
				<div className="plugin-content">
					<PluginTitleView
						name={name}
						author={author}
						version={version}
						flags={flags} />
					{description}
					<SwitchView
						offLabel={<SwitchValueView>Off</SwitchValueView>}
						onLabel={<SwitchValueView>On</SwitchValueView>} />
				</div>
			</div>
		);
	}
}
