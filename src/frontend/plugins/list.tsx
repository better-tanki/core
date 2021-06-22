import * as Classname from 'classnames';
import * as Bluebird from 'bluebird';
import * as React from 'react';

import { connect } from 'react-redux';
import { Component, ReactNode } from 'react';

import { Plugin } from '../../model/plugin/plugin';

import { RootStore } from '../store';
import { PluginsState } from '../actions';

import { PluginView } from './plugin';

export interface PluginListProps {
	plugins: Plugin[];
}

export interface PluginListState {
}

export class PluginListViewComponent extends Component<PluginListProps, PluginListState> {
	public constructor(props: PluginListProps) {
		super(props);

		this.state = {
		};
	}

	public render(): ReactNode {
		const {
			plugins
		}: PluginListProps = this.props;

		const {
		}: PluginListState = this.state;

		return (
			<div className="plugin-list">				
				{plugins.map((plugin: Plugin) => (
					<PluginView
						key={plugin.id}
						id={plugin.id}

						name={plugin.name}
						author={plugin.author}
						version={plugin.version}
						description={plugin.description}

						flags={plugin.flags}
					>{plugin.description}</PluginView>
				))}
			</div>
		);
	}
}

const mapStateToProps = (store: RootStore): PluginListProps => {
	const plugins: PluginsState = store.plugins;
	
	return {
		plugins: plugins.plugins.filter((plugin: Plugin) => {
			if(plugins.filter === null) return true;

			return plugin.name.toLowerCase().includes(plugins.filter.toLowerCase());
		})
	};
};

export const PluginListView = connect(mapStateToProps)(PluginListViewComponent);
