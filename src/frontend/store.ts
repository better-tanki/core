import Thunk, { ThunkMiddleware } from 'redux-thunk';

import { createStore, applyMiddleware } from 'redux';

import { rootReducer } from './reducers';

import {
	Actions,
	ModalsState, NotificationsState, PluginsState
} from './actions';

export const Store = createStore(
  rootReducer,
  applyMiddleware(Thunk as ThunkMiddleware<RootStore, Actions>),
);

export interface RootStore {
	notifications: NotificationsState;
	modals: ModalsState;

	plugins: PluginsState;
}
