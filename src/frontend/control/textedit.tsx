import * as React from 'react';

import { Component, ReactNode } from 'react';

import { Nullable } from '../../helper/type';

export interface TextEditProps {
	defaultValue?: string;
	placeholder?: string;

	onChange?: (value: Nullable<string>, component: TextEdit, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextEditState {
	value: Nullable<string>;

	focused: boolean;
	hover: boolean;
}

export class TextEdit extends Component<TextEditProps, TextEditState> {
	public constructor(props: TextEditProps) {
		super(props);

		this.state = {
			value: props.defaultValue ?? null,

			focused: false,
			hover: false
		};

		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);

		this.onChange = this.onChange.bind(this);
	}

	public get focused(): boolean {
		return this.state.focused;
	}

	public set focused(value: boolean) {
		this.setState({
			focused: value
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

	public get value(): Nullable<string> {
		return this.state.value;
	}

	public set value(value: Nullable<string>) {
		this.setState({
			value: value !== null ? value.length > 0 ? value : null : null
		});
	}

	public onFocus(event: React.FocusEvent<HTMLDivElement>): void {
		this.focused = true;
	}

	public onBlur(event: React.FocusEvent<HTMLDivElement>): void {
		this.focused = false;
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = true;
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.hover = false;
	}

	public onChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const value: Nullable<string> = event.target.value.length > 0 ? event.target.value : null;
		
		this.value = value;
		
		if(this.props.onChange) this.props.onChange(value, this, event);
	}

	public render(): ReactNode {
		return (
			<div className="textedit-wrapper">
				<input
					type="text"
					className={`textedit ${this.focused ? 'textedit--focused' : 'textedit--unfocused'} ${this.hover ? 'textedit--hover' : 'textedit--mouse-out'}`}
					defaultValue={this.props.defaultValue}
					placeholder={this.props.placeholder}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onChange={this.onChange} />
			</div>
		);
	}
}
