import * as React from 'react';

import { Component, ReactNode } from 'react';

export interface PluginIconProps {
	children?: ReactNode;
}

export interface PluginIconState {
}

export class PluginIconView extends Component<PluginIconProps, PluginIconState> {
	public constructor(props: PluginIconProps) {
		super(props);

		this.state = {
		};
	}

	public render(): ReactNode {
		const {
			children
		}: PluginIconProps = this.props;

		return (
			<div className="plugin-icon">
				{children}
			</div>
		);
	}
}
