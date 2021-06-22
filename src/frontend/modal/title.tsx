import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { ModalCloseButtonView } from './close';
import { ModalTitleIconView } from './icon';

export interface ModalTitleProps {
	icon?: ReactNode;

	children?: ReactNode;

	onClose?: (component: ModalTitleView) => void;
}

export interface ModalTitleState {
}

export class ModalTitleView extends Component<ModalTitleProps, ModalTitleState> {
	public constructor(props: ModalTitleProps) {
		super(props);

		this.state = {
			hover: false
		};

		this.onClose = this.onClose.bind(this);
	}

	private onClose(component: ModalCloseButtonView, event: React.MouseEvent<HTMLSpanElement>): void {
		if(this.props.onClose) this.props.onClose(this);
	}

	public render(): ReactNode {
		const {
			icon,
			children
		}: ModalTitleProps = this.props;

		return (
			<div className="modal-title-container">
				{icon ? (
					<ModalTitleIconView>{icon}</ModalTitleIconView>
				) : null}

				<div className="modal-title">
					{children}
				</div>
				
				<ModalCloseButtonView onClick={this.onClose} />
			</div>
		);
	}
}
