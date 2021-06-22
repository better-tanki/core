import * as Classname from 'classnames';
import * as Bluebird from 'bluebird';
import * as React from 'react';

import { Component, ReactNode, ReactElement } from 'react';

import { NotificationLevel } from '../../model/notification/notification';

import { NotificationTitleProps } from './title';

export interface NotificationProps {
	id: number;
	
	title?: ReactElement<NotificationTitleProps>;

	duration: number;

	level: NotificationLevel;

	slideOut: boolean;

	children?: ReactNode;
}

export interface NotificationState {
	hover: boolean;
}

export class NotificationView extends Component<NotificationProps, NotificationState> {
	public constructor(props: NotificationProps) {
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

	public set hover(hover: boolean) {
		this.setState({ hover: hover });
	}

	public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		// this.checked = !this.checked;
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public render(): ReactNode {
		const {
			title,
			level,
			slideOut,
			children
		}: NotificationProps = this.props;

		return (
			<div
				className={Classname('notification', {
					'notification--hover': this.hover,
					'notification--mouse-out': !this.hover,
					'notification--slide-out': slideOut
				})}
				onClick={this.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>
				<div className={Classname('notification-level', {
					'notification-level--debug': level === NotificationLevel.Debug,
					'notification-level--info': level === NotificationLevel.Info,
					'notification-level--warn': level === NotificationLevel.Warn,
					'notification-level--error': level === NotificationLevel.Error,
					'notification-level--fatal': level === NotificationLevel.Fatal,
				})}></div>
				<div className="notification-content">
					{title}
					{children}
				</div>
			</div>
		);
	}
}
