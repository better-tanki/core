import * as Bluebird from 'bluebird';

import { ThunkAction } from 'redux-thunk';

import { RootStore } from '../store';
import { Notification } from '../../model/notification/notification';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';

export const _BEGIN_HIDE_NOTIFICATION = '_BEGIN_HIDE_NOTIFICATION';
export const _HIDE_NOTIFICATION = '_HIDE_NOTIFICATION';

export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';

interface AddNotificationPayload extends Notification {
}

interface AddNotificationAction {
  type: typeof ADD_NOTIFICATION;
  payload: AddNotificationPayload;
}


interface _BeginHideNotificationPayload {
  id: number;
}

interface _BeginHideNotificationAction {
  type: typeof _BEGIN_HIDE_NOTIFICATION;
  payload: _BeginHideNotificationPayload;
}


interface _HideNotificationPayload {
  id: number;
}

interface _HideNotificationAction {
  type: typeof _HIDE_NOTIFICATION;
  payload: _HideNotificationPayload;
}

interface HideNotificationPayload {
  id: number;
}

interface DeleteNotificationPayload {
  id: number;
}

interface DeleteNotificationAction {
  type: typeof DELETE_NOTIFICATION;
  payload: DeleteNotificationPayload;
}

export type NotificationActions = AddNotificationAction | _BeginHideNotificationAction | _HideNotificationAction | DeleteNotificationAction;

export interface NotificationsState {
	notifications: Notification[];
}

export type ModalsThunkResult<R> = ThunkAction<R, RootStore, undefined, NotificationActions>;

export const addNotifcation = (payload: AddNotificationPayload): ModalsThunkResult<void> => (dispatch, getState) => {
	return dispatch({
		type: ADD_NOTIFICATION,
		payload: payload
	});
};

export const hideNotifcation = (payload: HideNotificationPayload): ModalsThunkResult<void> => async (dispatch, getState) => {
	dispatch({
		type: _BEGIN_HIDE_NOTIFICATION,
		payload: {
			id: payload.id
		}
	});

  await Bluebird.delay(500);
  
  return dispatch({
    type: _HIDE_NOTIFICATION,
    payload: {
      id: payload.id
    }
  });
};
