import * as Classname from 'classnames';
import * as Bluebird from 'bluebird';
import * as React from 'react';

import { connect } from 'react-redux';
import { Component, ReactNode } from 'react';

import { Nullable } from '../../helper/type';
import { Modal } from '../../model/modal/modal';

import { RootStore, Store } from '../store';
import { deleteModal, ModalsState } from '../actions';

import { ModalView } from './modal';

export interface ModalStackProps {
	modals: Modal[];
}

export interface ModalStackState {
}

export class ModalStackViewComponent extends Component<ModalStackProps, ModalStackState> {
	public constructor(props: ModalStackProps) {
		super(props);

		this.state = {
		};

		this.onClose = this.onClose.bind(this);
	}

	private async onClose(component: ModalView): Promise<void> {
		const id: number = component.props.id;

		Store.dispatch(deleteModal({
			id: id
		}));
	}

	public render(): ReactNode {
		const {
			modals
		}: ModalStackProps = this.props;

		const {
		}: ModalStackState = this.state;

		return (
			<div className="modal-stack">				
				{modals.map((modal: Modal) => (
					<ModalView
						key={modal.id}
						id={modal.id}

						title={modal.title ? modal.title.text : null}
						titleIcon={modal.title ? modal.title.icon : null}
						level={modal.level}

						fadeIn={modal.fadeIn}
						fadeOut={modal.fadeOut}

						onClose={this.onClose}
					>{modal.description}</ModalView>
				))}
			</div>
		);
	}
}

const mapStateToProps = (store: RootStore): ModalStackProps => {
	const modals: ModalsState = store.modals;
	
	return {
		modals: modals.modals
	};
};

export const ModalStackView = connect(mapStateToProps)(ModalStackViewComponent);
