import Update from 'immutability-helper';

import {
	ADD_MODAL,
	_BEGIN_SHOW_MODAL, _BEGIN_HIDE_MODAL,
	_DELETE_MODAL,
	ModalActions,
	ModalsState,
} from '../actions';

import { Modal } from '../../model/modal/modal';

const initialState: ModalsState = {
	modals: []
};

export function reducer(state = initialState, action: ModalActions): ModalsState {
  switch(action.type) {
    case ADD_MODAL: {
      return {
        modals: [ ...state.modals, action.payload ]
      };
		}

    case _BEGIN_SHOW_MODAL: {
			const index: number = state.modals.findIndex((modal: Modal) => modal.id === action.payload.id);
			const modals: Modal[] = Update(state.modals, {
				[index]: {
					fadeIn: { $set: true }
				}
			});

      return {
        modals: modals
      };
		}

    case _BEGIN_HIDE_MODAL: {
			const index: number = state.modals.findIndex((modal: Modal) => modal.id === action.payload.id);
			const modals: Modal[] = Update(state.modals, {
				[index]: {
					fadeOut: { $set: true }
				}
			});

      return {
        modals: modals
      };
		}

    case _DELETE_MODAL: {
      return {
        modals: state.modals.filter((modal: Modal) => modal.id !== action.payload.id)
      };
		}
		
    default: {
			return state;
		}
  }
}
