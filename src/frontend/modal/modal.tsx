import * as Classname from 'classnames';
import * as Bluebird from 'bluebird';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { ModalLevel } from '../../model/modal/modal';

import { ModalTitleView } from './title';

export interface ModalProps {
	id: number;

	title?: ReactNode;
	titleIcon?: ReactNode;

	level: ModalLevel;

	fadeIn: boolean;
	fadeOut: boolean;

	children?: ReactNode;

	onClose?: (component: ModalView) => void;
}

export interface ModalState {
	hover: boolean;
}

export class ModalView extends Component<ModalProps, ModalState> {
	public constructor(props: ModalProps) {
		super(props);

		this.state = {
			hover: false
		};

		this.onClose = this.onClose.bind(this);
	}

	private onClose(component: ModalTitleView): void {
		if(this.props.onClose) this.props.onClose(this);
	}

	public get hover(): boolean {
		return this.state.hover;
	}

	public set hover(hover: boolean) {
		this.setState({ hover: hover });
	}

	public render(): ReactNode {
		const {
			title,
			titleIcon,

			level,
			fadeIn,
			fadeOut,
			children
		}: ModalProps = this.props;

		return (
			<div className={Classname('modal-wrapper', {
				'modal-wrapper--fade-in': fadeIn,
				'modal-wrapper--fade-out': fadeOut
			})}>
				<div
					className={Classname('modal', {
						'modal--hover': this.hover,
						'modal--mouse-out': !this.hover,
						'modal--fade-in': fadeIn,
						'modal--fade-out': fadeOut
					})}
				>
					<div className={Classname('modal-level', {
						'modal-level--debug': level === ModalLevel.Debug,
						'modal-level--info': level === ModalLevel.Info,
						'modal-level--warn': level === ModalLevel.Warn,
						'modal-level--error': level === ModalLevel.Error,
						'modal-level--fatal': level === ModalLevel.Fatal,
					})}></div>
					<ModalTitleView
						icon={titleIcon}
						onClose={this.onClose}
					>{title}</ModalTitleView>
					<div className="modal-content">
						{children}
					</div>
				</div>
			</div>
		);
	}
}
