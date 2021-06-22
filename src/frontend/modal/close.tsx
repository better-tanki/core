import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

export interface ModalCloseButtonProps {
	onClick?: (component: ModalCloseButtonView, event: React.MouseEvent<HTMLSpanElement>) => void;
}

export interface ModalCloseButtonState {
}

export class ModalCloseButtonView extends Component<ModalCloseButtonProps, ModalCloseButtonState> {
	public constructor(props: ModalCloseButtonProps) {
		super(props);

		this.state = {
			hover: false
		};

		this.onClick = this.onClick.bind(this);
	}

	private onClick(event: React.MouseEvent<HTMLSpanElement>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public render(): ReactNode {
		const {
		}: ModalCloseButtonProps = this.props;

		return (
			<span
				className="modal-title-close material-icons"
				onClick={this.onClick}
			>close</span>
		);
	}
}
