import * as React from 'react';

import { Component, ReactNode } from 'react';

import { Nullable } from '../../helper/type';

export interface PluginErrorBoundaryProps {

}

export interface PluginErrorBoundaryState {
	error: Nullable<Error>;
}

export class PluginErrorBoundary extends Component<PluginErrorBoundaryProps, PluginErrorBoundaryState> {
	public constructor(props: PluginErrorBoundaryProps) {
		super(props);

		this.state = {
			error: null
		};
	}

	public async componentDidMount(): Promise<void> {
	}

	public static getDerivedStateFromError(error: Error): Partial<PluginErrorBoundaryState> {
		return {
			error: error
		};
	}

	public render(): ReactNode {
		const error: Nullable<Error> = this.state.error;

		if(error) {
			return (
				<div className="btp-error">
					<span className="btp-error-name">{error.name}:</span> <span className="btp-error-message">{error.message}</span>
					<pre className="btp-error-stack">{error.stack}</pre>
				</div>
			);
		}

		return this.props.children;
	}
}
