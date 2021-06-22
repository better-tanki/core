import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { PluginFlags } from '../../model/plugin/plugin';

export interface PluginTitleProps {
	name: ReactNode;
	author: ReactNode;
	version: ReactNode;

	flags: PluginFlags;
}

export interface PluginTitleState {
}

export class PluginTitleView extends Component<PluginTitleProps, PluginTitleState> {
	public constructor(props: PluginTitleProps) {
		super(props);

		this.state = {
			hover: false
		};
	}

	public render(): ReactNode {
		const {
			name,
			author,
			version,

			flags
		}: PluginTitleProps = this.props;

		return (
			<div className="plugin-title">
				<div className="plugin-name-version">
					<div className="plugin-name">{name}</div>
					<div className="plugin-version">{version}</div>
				</div>
				
				<div>
					<div className="plugin-author">
						<span className="plugin-author--name">от</span>
						<div className="plugin-author--value">{author}</div>
					</div>
				</div>

				{/* <div className="plugin-flags">{flags.valueOf()}</div> */}
			</div>
		);
	}
}
