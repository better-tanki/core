import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';

export interface ListProps extends BaseProps {
	children: ReactNode;
	
	onClick?: (component: ListView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ListState {
}

export class ListView extends Component<ListProps, ListState> {
	public constructor(props: ListProps) {
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
			children,
			id, className,
			style
		}: ListProps = this.props;

		return (
			<div
				className={Classname('list', className)}
				id={id}
				style={style}
				onClick={this.onClick}
			>
				{children}
			</div>
		);
	}
}
