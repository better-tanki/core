import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';

export interface TreeNodeIconProps extends BaseProps {
	opened: boolean;
	
	onClick?: (component: TreeNodeIconView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface TreeNodeIconState {
	hover: boolean;
}

export class TreeNodeIconView extends Component<TreeNodeIconProps, TreeNodeIconState> {
	public constructor(props: TreeNodeIconProps) {
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
		this.setState({
			hover: true
		});
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.setState({
			hover: false
		});
	}

	public render(): ReactNode {
		const {
			opened,
			id, className,
			style
		}: TreeNodeIconProps = this.props;

		const {
			hover
		}: TreeNodeIconState = this.state;

		return (
			<span
				className={Classname('tree-node-icon', 'material-icons-round', className, {
					'tree-node--hover': hover
				})}
				id={id}
				style={style}
				onClick={this.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>{opened ? 'expand_more' : 'chevron_right'}</span>
		);
	}
}
