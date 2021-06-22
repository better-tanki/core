import Update from 'immutability-helper';

import {
	ADD_NOTIFICATION,
	_BEGIN_HIDE_NOTIFICATION, _HIDE_NOTIFICATION,
	DELETE_NOTIFICATION,
	NotificationActions,
	NotificationsState
} from '../actions';

import { Notification } from '../../model/notification/notification';

const initialState: NotificationsState = {
	notifications: []
};

export function reducer(state = initialState, action: NotificationActions): NotificationsState {
  switch(action.type) {
    case ADD_NOTIFICATION: {
      return {
        notifications: [ ...state.notifications, action.payload ]
      };
		}

    case _BEGIN_HIDE_NOTIFICATION: {
			const index: number = state.notifications.findIndex((notification: Notification) => notification.id === action.payload.id);
			const notifications: Notification[] = Update(state.notifications, {
				[index]: {
					slideOut: { $set: true }
				}
			});

      return {
        notifications: notifications
      };
		}

    case _HIDE_NOTIFICATION: {
			const index: number = state.notifications.findIndex((notification: Notification) => notification.id === action.payload.id);
			const notifications: Notification[] = Update(state.notifications, {
				[index]: {
					hidden: { $set: true }
				}
			});

      return {
        notifications: notifications
      };
		}

    case DELETE_NOTIFICATION: {
      return {
        notifications: state.notifications.filter((notification: Notification) => notification.id !== action.payload.id)
      };
		}
		
    default: {
			return state;
		}
  }
}
