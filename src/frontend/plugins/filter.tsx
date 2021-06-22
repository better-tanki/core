import * as Classname from 'classnames';
import * as Bluebird from 'bluebird';
import * as React from 'react';
import * as _ from 'lodash';

import { connect } from 'react-redux';
import { Component, ReactNode } from 'react';

import { Nullable } from '../../helper/type';
import { Plugin } from '../../model/plugin/plugin';

import { RootStore } from '../store';
import { Actions, PluginsState, setPluginFilter } from '../actions';

import { TextEdit } from '../control/textedit';
import { ThunkDispatch } from 'redux-thunk';

export interface PluginFilterProps {
	filter?: Nullable<string>;

	onChange?: (filter: Nullable<string>, component: PluginFilterViewComponent, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PluginFilterState {
}

export class PluginFilterViewComponent extends Component<PluginFilterProps, PluginFilterState> {
	public constructor(props: PluginFilterProps) {
		super(props);

		this.state = {
		};

		this.onChange = this.onChange.bind(this);
	}

	private onChange(value: Nullable<string>, component: TextEdit, event: React.ChangeEvent<HTMLInputElement>): void {
		console.log(value);
		if(this.props.onChange) this.props.onChange(value, this, event);
	}

	public render(): ReactNode {
		const {
		}: PluginFilterProps = this.props;

		return (
			<div
				className={Classname('plugin-filter')}
			>
				<TextEdit
					placeholder="Поиск плагинов"
					onChange={this.onChange} />
			</div>
		);
	}
}

const mapStateToProps = (store: RootStore): Partial<PluginFilterProps> => {
	const plugins: PluginsState = store.plugins;
	
	return {
		filter: plugins.filter
	};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootStore, undefined, Actions>): Partial<PluginFilterProps> => {
  return {
  	onChange: (filter: Nullable<string>) => dispatch(setPluginFilter({
			filter: filter
		}))
  }
};

export const PluginFilterView = connect(mapStateToProps, mapDispatchToProps)(PluginFilterViewComponent);
