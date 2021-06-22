import * as Bluebird from 'bluebird';

import { ThunkAction } from 'redux-thunk';

import { RootStore } from '../store';
import { Modal } from '../../model/modal/modal';

export const ADD_MODAL = 'ADD_MODAL';

export const _BEGIN_SHOW_MODAL = '_BEGIN_SHOW_MODAL';

export const _BEGIN_HIDE_MODAL = '_BEGIN_HIDE_MODAL';
export const _DELETE_MODAL = '_DELETE_MODAL';

interface AddModalPayload extends Modal {
}

interface AddModalAction {
  type: typeof ADD_MODAL;
  payload: AddModalPayload;
}


interface _BeginShowModalPayload {
  id: number;
}

interface _BeginShowModalAction {
  type: typeof _BEGIN_SHOW_MODAL;
  payload: _BeginShowModalPayload;
}


interface _BeginHideModalPayload {
  id: number;
}

interface _BeginHideModalAction {
  type: typeof _BEGIN_HIDE_MODAL;
  payload: _BeginHideModalPayload;
}


interface _DeleteModalPayload {
  id: number;
}

interface _DeleteModalAction {
  type: typeof _DELETE_MODAL;
  payload: _DeleteModalPayload;
}

interface DeleteModalPayload {
  id: number;
}

export type ModalActions = AddModalAction | _BeginShowModalAction | _BeginHideModalAction | _DeleteModalAction;

export interface ModalsState {
	modals: Modal[];
}

export type NotificationsThunkResult<R> = ThunkAction<R, RootStore, undefined, ModalActions>;

export const addModal = (payload: AddModalPayload): NotificationsThunkResult<void> => async (dispatch, getState) => {
	dispatch({
		type: ADD_MODAL,
		payload: payload
	});
  
  dispatch({
    type: _BEGIN_SHOW_MODAL,
    payload: {
      id: payload.id
    }
  });
};

export const deleteModal = (payload: DeleteModalPayload): NotificationsThunkResult<void> => async (dispatch, getState) => {
	dispatch({
		type: _BEGIN_HIDE_MODAL,
		payload: {
			id: payload.id
		}
	});

  await Bluebird.delay(1500);
  
  return dispatch({
    type: _DELETE_MODAL,
    payload: {
      id: payload.id
    }
  });
};
