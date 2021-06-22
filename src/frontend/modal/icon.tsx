import * as React from 'react';

import { Component, ReactNode } from 'react';

export interface ModalTitleIconProps {
	children?: ReactNode;
}

export interface ModalTitleIconState {
}

export class ModalTitleIconView extends Component<ModalTitleIconProps, ModalTitleIconState> {
	public constructor(props: ModalTitleIconProps) {
		super(props);

		this.state = {
		};
	}

	public render(): ReactNode {
		const {
			children
		}: ModalTitleIconProps = this.props;

		return (
			<div className="modal-icon">
				{children}
			</div>
		);
	}
}
