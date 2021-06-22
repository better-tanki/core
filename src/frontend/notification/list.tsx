import * as Classname from 'classnames';
import * as Bluebird from 'bluebird';
import * as React from 'react';

import { connect } from 'react-redux';
import { Component, ReactNode } from 'react';

import { Nullable } from '../../helper/type';
import { Notification } from '../../model/notification/notification';

import { RootStore, Store } from '../store';
import { hideNotifcation, NotificationsState } from '../actions';

import { NotificationIconView } from './icon';
import { NotificationTitleView } from './title';
import { NotificationView } from './notification';

export interface NotificationListProps {
	notifications: Notification[];
}

export interface NotificationListState {
}

export class NotificationListViewComponent extends Component<NotificationListProps, NotificationListState> {
	private destroyPromise: Nullable<Bluebird<void>>;

	public constructor(props: NotificationListProps) {
		super(props);

		this.state = {
		};

		this.destroyPromise = null;
	}
	
	public async componentDidUpdate(): Promise<void> {
		const {
			notifications
		}: NotificationListProps = this.props;

		if(this.destroyPromise) return;

		const notification: Nullable<Notification> = notifications.filter((notification: Notification) => !notification.hidden)[0] ?? null;

		if(!notification) return;

		this.destroyPromise = Bluebird
			.delay(notification.duration.shiftTo('milliseconds').milliseconds)
			.then(async () => {
				Store.dispatch(hideNotifcation({
					id: notification.id
				}));
				
				this.destroyPromise = null;
			});
	}

	public componentWillUnmount(): void {
		if(this.destroyPromise && !this.destroyPromise.isResolved()) this.destroyPromise.cancel();
	}

	public render(): ReactNode {
		const {
			notifications
		}: NotificationListProps = this.props;

		const {
		}: NotificationListState = this.state;

		return (
			<div className="notification-list">
				<div className="notification-spacer"></div>
				
				{notifications.map((notification: Notification) => (
					<NotificationView
						key={notification.id}
						id={notification.id}

						title={notification.title ? (
							<NotificationTitleView icon={
								<NotificationIconView>{notification.title.icon}</NotificationIconView>
							}>{notification.title.text}</NotificationTitleView>
						) : undefined}
						duration={notification.duration.shiftTo('milliseconds').milliseconds}
						level={notification.level}

						slideOut={notification.slideOut}
					>{notification.description}</NotificationView>
				))}
			</div>
		);
	}
}

const mapStateToProps = (store: RootStore): NotificationListProps => {
	const notifications: NotificationsState = store.notifications;
	
	return {
		notifications: notifications.notifications.filter((notification: Notification) => !notification.hidden)
	};
};

export const NotificationListView = connect(mapStateToProps)(NotificationListViewComponent);
