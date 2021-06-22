import * as React from 'react';

import { List } from '@assasans/storage';
import { Component, ReactNode } from 'react';

import { Nullable } from '../../../helper/type';

export interface DropdownItemProps {
	title: string;
	
	selected?: boolean;
}

export interface DropdownItemState {
	title: string;

	hover: boolean;
	selected: boolean;
}

export class DropdownItem extends Component<DropdownItemProps, DropdownItemState> {
	public constructor(props: DropdownItemProps) {
		super(props);

		this.state = {
			title: props.title,

			hover: false,
			selected: props.selected ?? false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	public get title(): string {
		return this.state.title;
	}

	public set title(value: string) {
		this.setState({
			title: value
		});
	}

	public get hover(): boolean {
		return this.state.hover;
	}

	public set hover(value: boolean) {
		this.setState({
			hover: value
		});
	}

	public get selected(): boolean {
		return this.state.selected;
	}

	public set selected(value: boolean) {
		this.setState({
			selected: value
		});
	}

	public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.selected = true;
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public render(): ReactNode {
		return (
			<div
				className={`dropdown-item ${this.hover ? 'dropdown-item--hover' : 'dropdown-item--mouse-out'} ${this.selected ? 'dropdown-item--selected' : 'dropdown-item--unselected'}`}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onClick={this.onClick}
			>
				{this.title}
			</div>
		);
	}
}
