import * as Bluebird from 'bluebird';

import { ThunkAction } from 'redux-thunk';

import { RootStore } from '../store';

import { Nullable } from '../../helper/type';
import { Plugin } from '../../model/plugin/plugin';

export const ADD_PLUGIN = 'ADD_PLUGIN';
export const DELETE_PLUGIN = 'DELETE_PLUGIN';

export const SET_PLUGIN_FILTER = 'SET_PLUGIN_FILTER';

interface AddPluginPayload extends Plugin {
}

interface AddPluginAction {
  type: typeof ADD_PLUGIN;
  payload: AddPluginPayload;
}


interface DeletePluginPayload {
  id: number;
}

interface DeletePluginAction {
  type: typeof DELETE_PLUGIN;
  payload: DeletePluginPayload;
}


interface SetPluginFilterPayload {
  filter: Nullable<string>;
}

interface SetPluginFilterAction {
  type: typeof SET_PLUGIN_FILTER;
  payload: SetPluginFilterPayload;
}

export type PluginActions = AddPluginAction | DeletePluginAction | SetPluginFilterAction;

export interface PluginsState {
  filter: Nullable<string>;
	plugins: Plugin[];
}

export type PluginsThunkResult<R> = ThunkAction<R, RootStore, undefined, PluginActions>;

export const addPlugin = (payload: AddPluginPayload): PluginsThunkResult<void> => (dispatch, getState) => {
	dispatch({
		type: ADD_PLUGIN,
		payload: payload
	});
};

export const deletePlugin = (payload: DeletePluginPayload): PluginsThunkResult<void> => (dispatch, getState) => {
  return dispatch({
    type: DELETE_PLUGIN,
    payload: {
      id: payload.id
    }
  });
};

export const setPluginFilter = (payload: SetPluginFilterPayload): PluginsThunkResult<void> => (dispatch, getState) => {
  return dispatch({
    type: SET_PLUGIN_FILTER,
    payload: {
      filter: payload.filter
    }
  });
};
window.actions = exports;
