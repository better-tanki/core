import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';
import { MathUtils } from '../../../helper/math';

import { BaseProps } from '../../props';

export interface ProgressBarProps extends BaseProps {
	minimum: number;
	maximum: number;

	value: number;

	onClick?: (component: ProgressBarView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ProgressBarState {
}

export class ProgressBarView extends Component<ProgressBarProps, ProgressBarState> {
	public static defaultProps: Partial<ProgressBarProps> = {
		minimum: 0,
		maximum: 100
	};

	public constructor(props: ProgressBarProps) {
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
		}: ProgressBarProps = this.props;

		const width: number = MathUtils.map(value, minimum, maximum, 0, 100);
		
		return (
			<div
				className={Classname('progress', className)}
				id={id}
				style={style}
				onClick={this.onClick}
			>
				<div className={Classname('progress-value')} style={{
					width: `${width.toFixed(3)}%`
				}}></div>
			</div>
		);
	}
}
