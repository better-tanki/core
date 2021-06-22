import * as React from 'react';

import { Component, ReactNode } from 'react';

export interface CheckBoxProps {
	checked?: boolean;
}

export interface CheckBoxState {
	checked: boolean;
	hover: boolean;
}

export class CheckBox extends Component<CheckBoxProps, CheckBoxState> {
	public constructor(props: CheckBoxProps) {
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
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public render(): ReactNode {
		return (
			<div className="checkbox-wrapper">
				<div
					className={`checkbox ${this.checked ? 'checkbox--checked' : 'checkbox--unchecked'} ${this.hover ? 'checkbox--hover' : 'checkbox--mouse-out'}`}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}
					onClick={this.onClick}
				>
				</div>
			</div>
		);
	}
}
