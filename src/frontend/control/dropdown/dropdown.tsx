import * as React from 'react';

import { List } from '@assasans/storage';
import { Component, ReactNode } from 'react';

import { Nullable } from '../../../helper/type';
import { DropdownItem } from './dropdown-item';

export interface DropdownProps {
	opened?: boolean;

	items: List<string>;

	selected?: Nullable<number>;
}

export interface DropdownState {
	opened: boolean;
	hover: boolean;

	items: List<string>;

	selected: Nullable<number>;
}

export class Dropdown extends Component<DropdownProps, DropdownState> {
	public constructor(props: DropdownProps) {
		super(props);

		this.state = {
			opened: props.opened ?? false,
			hover: false,

			items: props.items,

			selected: props.selected ?? null
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	public get items(): List<string> {
		return this.state.items;
	}

	public set items(value: List<string>) {
		this.setState({
			items: value
		});
	}

	public get opened(): boolean {
		return this.state.opened;
	}

	public set opened(value: boolean) {
		this.setState({
			opened: value
		});
	}

	public get selected(): Nullable<number> {
		return this.state.selected;
	}

	public set selected(value: Nullable<number>) {
		this.setState({
			selected: value
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

	public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.opened = !this.opened;
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public render(): ReactNode {
		return (
			<div className="dropdown-wrapper">
				<div
					className={`dropdown ${this.opened ? 'dropdown--opened' : 'dropdown--closed'} ${this.hover ? 'dropdown--hover' : 'dropdown--mouse-out'}`}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}
					onClick={this.onClick}
				>
				</div>
				
				<div className="dropdown-items">
					{this.items.map((item: string, index: number) => (
						<DropdownItem
							title={item}
							selected={index === this.selected}
							key={index} />
					))}
				</div>
			</div>
		);
	}
}
