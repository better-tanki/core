import * as React from 'react';

import { Component } from 'react';

export interface ProgressBarProps {
	progress: number;
}

export interface ProgressBarState {
	progress: number;
}

export class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
	public constructor(props: ProgressBarProps) {
		super(props);

		this.state = {
			progress: props.progress
		};
	}

	public setProgress(progress: number): void {
		this.setState({
			progress: progress
		});
	}

	public render(): React.ReactNode {
		return (
			<div className="progress-bar">
				<div
					className="progress-bar__fill"
					style={{
						width: `${this.state.progress}%`
					}}
				></div>
			</div>
		);
	}
}
