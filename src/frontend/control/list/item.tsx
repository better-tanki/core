import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';

export interface ListItemProps extends BaseProps {
	children: ReactNode;
	
	onClick?: (component: ListItemView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ListItemState {
	hover: boolean;
}

export class ListItemView extends Component<ListItemProps, ListItemState> {
	public constructor(props: ListItemProps) {
		super(props);

		this.state = {
			hover: false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	public get hover(): boolean {
		return this.state.hover;
	}

	public set hover(value: boolean) {
		this.setState({
			hover: value
		});
	}

	private onClick(event: React.MouseEvent<HTMLDivElement>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public render(): ReactNode {
		const {
			children,
			id, className,
			style
		}: ListItemProps = this.props;

		return (
			<div
				className={Classname('list-item', className, {
					'list-item--hover': this.hover,
					'list-item--mouse-out': !this.hover
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
