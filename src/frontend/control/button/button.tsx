import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';

export interface ButtonProps extends BaseProps {
	children: ReactNode;
	
	onClick?: (component: ButtonView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ButtonState {
	hover: boolean;
}

export class ButtonView extends Component<ButtonProps, ButtonState> {
	public constructor(props: ButtonProps) {
		super(props);

		this.state = {
			hover: false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	private onClick(event: React.MouseEvent<HTMLDivElement>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {		
		this.setState((state) => ({
			hover: true
		}));
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.setState({
			hover: false
		});
	}

	public render(): ReactNode {
		const {
			children,
			id, className,
			style
		}: ButtonProps = this.props;

		const {
			hover
		}: ButtonState = this.state;

		return (
			<div
				className={Classname('button', className, {
					'button--hover': hover
				})}
				id={id}
				style={style}
				onClick={this.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>
				{children}
			</div>
		);
	}
}
