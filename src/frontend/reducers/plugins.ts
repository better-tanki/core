import Update from 'immutability-helper';

import {
	ADD_PLUGIN,
	DELETE_PLUGIN,
	SET_PLUGIN_FILTER,
	PluginActions,
	PluginsState
} from '../actions';

import { Plugin } from '../../model/plugin/plugin';

const initialState: PluginsState = {
	filter: null,
	plugins: []
};

export function reducer(state = initialState, action: PluginActions): PluginsState {
  switch(action.type) {
    case ADD_PLUGIN: {
      return {
				filter: state.filter,
        plugins: [ ...state.plugins, action.payload ]
      };
		}

    case DELETE_PLUGIN: {
      return {
				filter: state.filter,
        plugins: state.plugins.filter((plugin: Plugin) => plugin.id !== action.payload.id)
      };
		}
		
    case SET_PLUGIN_FILTER: {
      return {
				filter: action.payload.filter,
        plugins: state.plugins
      };
		}
		
    default: {
			return state;
		}
  }
}
