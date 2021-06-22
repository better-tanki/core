import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';

export interface TreeProps extends BaseProps {
	children: ReactNode;
	
	onClick?: (component: TreeView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface TreeState {
}

export class TreeView extends Component<TreeProps, TreeState> {
	public constructor(props: TreeProps) {
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
		}: TreeProps = this.props;

		return (
			<div
				className={Classname('tree', className)}
				id={id}
				style={style}
				onClick={this.onClick}
			>
				{children}
			</div>
		);
	}
}
