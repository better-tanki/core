import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { Orientation } from '../../../model/orientation';

import { BaseProps } from '../../props';

export interface ButtonGroupProps extends BaseProps {
	orientation?: Orientation;

	children?: ReactNode;
}

export interface ButtonGroupState {
}

export class ButtonGroupView extends Component<ButtonGroupProps, ButtonGroupState> {
	public static defaultProps: Partial<ButtonGroupProps> = {
		orientation: Orientation.Horizontal
	};

	public constructor(props: ButtonGroupProps) {
		super(props);

		this.state = {
		};
	}

	public render(): ReactNode {
		const {
			orientation,
			children,
			id, className,
			style
		}: ButtonGroupProps = this.props;

		return (
			<div
				className={Classname('button-group', className, {
					'button-group--horizontal': orientation === Orientation.Horizontal,
					'button-group--vertical': orientation === Orientation.Vertical
				})}
				id={id}
				style={style}
			>
				{children}
			</div>
		);
	}
}
