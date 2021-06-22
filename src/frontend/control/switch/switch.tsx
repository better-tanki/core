import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode, ReactElement } from 'react';

import { Nullable } from '../../../helper/type';

import { SwitchValueProps } from './switch-value';

export interface SwitchProps {
	checked?: boolean;

	offLabel?: ReactElement<SwitchValueProps>;
	onLabel?: ReactElement<SwitchValueProps>;

	onChange?: (checked: boolean, component: SwitchView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface SwitchState {
	checked: boolean;
	hover: boolean;
}

export class SwitchView extends Component<SwitchProps, SwitchState> {
	public constructor(props: SwitchProps) {
		super(props);

		this.state = {
			checked: props.checked ?? false,
			hover: false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	public get checked(): boolean {
		return this.state.checked;
	}

	public set checked(value: boolean) {
		this.setState({
			checked: value
		});
	}

	public get hover(): boolean {
		return this.state.hover;
	}

	public set hover(value: boolean) {
		this.setState({
			hover: value
		});
	}

	public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.checked = !this.checked;

		if(this.props.onChange) this.props.onChange(this.checked, this, event);
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public render(): ReactNode {
		const componentOff: Nullable<ReactElement> = this.props.offLabel ?? null;
		const componentOn: Nullable<ReactElement> = this.props.onLabel ?? null;

		return (
			<div className="switch-wrapper">
				{componentOff}
				<div
					className={Classname('switch', {
						'switch--checked': this.checked,
						'switch--unchecked': !this.checked,
						'switch--hover': this.hover,
						'switch--mouse-out': !this.hover
					})}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}
					onClick={this.onClick}
				>
				</div>
				{componentOn}
			</div>
		);
	}
}
