import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../../props';
import { TreeNodeIconView } from './icon';

export interface TreeNodeProps extends BaseProps {
	title: ReactNode;

	root?: boolean;

	children?: ReactNode;
	
	onClick?: (component: TreeNodeView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface TreeNodeState {
	hover: boolean;

	opened: boolean;
}

export class TreeNodeView extends Component<TreeNodeProps, TreeNodeState> {
	public constructor(props: TreeNodeProps) {
		super(props);

		this.state = {
			hover: false,

			opened: false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	private onClick(event: React.MouseEvent<HTMLDivElement>): void {
		if(React.Children.count(this.props.children) < 1) return;

		this.setState((state) => ({
			opened: !state.opened
		}));

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
			title,
			root,
			children,
			id, className,
			style
		}: TreeNodeProps = this.props;

		const {
			hover,
			opened
		}: TreeNodeState = this.state;

		const hasChildren: boolean = React.Children.count(this.props.children) > 0;

		return (
			<div
				className={Classname('tree-node', className, {
					'tree-node--has-children': hasChildren,
					'tree-node--root': root
				})}
				id={id}
				style={style}
			>
				<div
					className={Classname('tree-node-header', className, {
						'tree-node-header--hover': hover
					})}
					onClick={this.onClick}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}
				>
					{children ? (
						<TreeNodeIconView opened={opened} />
					) : null}
					<div className="tree-node-header-title">
						{title}
					</div>
				</div>
				
				{opened ? (
					<div className="tree-node-children">
						{children}
					</div>
				) : null}
			</div>
		);
	}
}
