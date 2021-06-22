import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';
import { MathUtils } from '../../../helper/math';

import { BaseProps } from '../../props';

export interface CircularProgressBarProps extends BaseProps {
	minimum: number;
	maximum: number;

	value: number;

	onClick?: (component: CircularProgressBarView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface CircularProgressBarState {
}

export class CircularProgressBarView extends Component<CircularProgressBarProps, CircularProgressBarState> {
	public static defaultProps: Partial<CircularProgressBarProps> = {
		minimum: 0,
		maximum: 100
	};

	public constructor(props: CircularProgressBarProps) {
		super(props);

		this.state = {
		};

		this.onClick = this.onClick.bind(this);
	}

	private onClick(event: React.MouseEvent<HTMLDivElement>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public render(): ReactNode {
		const {
			minimum, maximum,
			value,
			id, className,
			style
		}: CircularProgressBarProps = this.props;

		const width: number = MathUtils.map(value, minimum, maximum, 0, 100);
		
		return (
			<div
				className={Classname('progress-circular', className)}
				id={id}
				style={style}
				onClick={this.onClick}
			>
				Not implemented!
			</div>
		);
	}
}
