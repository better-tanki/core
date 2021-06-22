import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';

export interface BorderlessButtonProps extends BaseProps {
	children: ReactNode;
	
	onClick?: (component: BorderlessButtonView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface BorderlessButtonState {
	hover: boolean;

	active: boolean;
	internalActive: boolean;
}

export class BorderlessButtonView extends Component<BorderlessButtonProps, BorderlessButtonState> {
	public constructor(props: BorderlessButtonProps) {
		super(props);

		this.state = {
			hover: false,

			active: false,
			internalActive: false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerUp = this.onPointerUp.bind(this);
	}

	private onClick(event: React.MouseEvent<HTMLDivElement>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.setState((state) => ({
			hover: true,
			active: state.internalActive
		}));
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.setState({
			hover: false,
			active: false
		});
	}

	public onPointerDown(event: React.PointerEvent<HTMLDivElement>): void {
		this.setState({
			active: true,
			internalActive: true
		});
	}

	public onPointerUp(event: React.PointerEvent<HTMLDivElement>): void {
		this.setState({
			active: false,
			internalActive: false
		});
	}

	public render(): ReactNode {
		const {
			children,
			id, className,
			style
		}: BorderlessButtonProps = this.props;

		const {
			hover,
			active
		}: BorderlessButtonState = this.state;

		return (
			<div
				className={Classname('button', 'button--borderless', className, {
					'button--hover': hover,
					'button--active': active
				})}
				id={id}
				style={style}
				onClick={this.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onPointerDown={this.onPointerDown}
				onPointerUp={this.onPointerUp}
			>
				{children}
			</div>
		);
	}
}
