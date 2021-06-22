import * as React from 'react';

import { Component, ReactNode } from 'react';

export interface SettingsSectionProps {
	title: string;
}

export interface SettingsSectionState {
	title: string;
	hover: boolean;
}

export class SettingsSection extends Component<SettingsSectionProps, SettingsSectionState> {
	public constructor(props: SettingsSectionProps) {
		super(props);

		this.state = {
			title: props.title,
			hover: false
		};
	}

	public get title(): string {
		return this.state.title;
	}

	public set title(value: string) {
		this.setState({
			title: value
		});
	}

	public render(): ReactNode {
		return (
			<div className="settings-section-wrapper">
				<div className="settings-section">
					<span className="section-title">{this.state.title}</span>
					<div className="section-content">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}
