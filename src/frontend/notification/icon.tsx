import * as React from 'react';

import { Component, ReactNode } from 'react';

export interface NotificationIconProps {
	children?: ReactNode;
}

export interface NotificationIconState {
}

export class NotificationIconView extends Component<NotificationIconProps, NotificationIconState> {
	public constructor(props: NotificationIconProps) {
		super(props);

		this.state = {
		};
	}

	public render(): ReactNode {
		const {
			children
		}: NotificationIconProps = this.props;

		return (
			<div className="notification-icon">
				{children}
			</div>
		);
	}
}
