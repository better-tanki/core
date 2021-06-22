import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode, ReactElement } from 'react';

import { NotificationIconProps } from './icon';

export interface NotificationTitleProps {
	icon?: ReactElement<NotificationIconProps>;

	children?: ReactNode;
}

export interface NotificationTitleState {
}

export class NotificationTitleView extends Component<NotificationTitleProps, NotificationTitleState> {
	public constructor(props: NotificationTitleProps) {
		super(props);

		this.state = {
			hover: false
		};
	}

	public render(): ReactNode {
		const {
			icon,
			children
		}: NotificationTitleProps = this.props;

		return (
			<div className="notification-title-container">
				{icon ? icon : null}
				<div className="notification-title">
					{children}
				</div>
			</div>
		);
	}
}
