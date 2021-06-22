import { combineReducers } from 'redux';

import { reducer as notifications } from './notifications';
import { reducer as modals } from './modals';

import { reducer as plugins } from './plugins';

export const rootReducer = combineReducers({
	notifications,
	modals,
	plugins
});
