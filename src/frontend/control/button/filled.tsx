import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';

export interface FilledButtonProps extends BaseProps {
	children: ReactNode;
	
	onClick?: (component: FilledButtonView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface FilledButtonState {
	hover: boolean;

	active: boolean;
	internalActive: boolean;
}

export class FilledButtonView extends Component<FilledButtonProps, FilledButtonState> {
	public constructor(props: FilledButtonProps) {
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
		}: FilledButtonProps = this.props;

		const {
			hover,
			active
		}: FilledButtonState = this.state;

		return (
			<div
				className={Classname('button', 'button--filled', className, {
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
