import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

export interface SwitchValueProps {
	onClick?: (component: SwitchValueView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface SwitchValueState {
}

export class SwitchValueView extends Component<SwitchValueProps, SwitchValueState> {
	public constructor(props: SwitchValueProps) {
		super(props);

		this.state = {
		};

		this.onClick = this.onClick.bind(this);
	}

	public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public render(): ReactNode {
		return (
			<div
				className="switch-value"
				onClick={this.onClick}
			>
				{this.props.children}
			</div>
		);
	}
}
