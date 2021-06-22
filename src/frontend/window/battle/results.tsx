import * as React from 'react';
import * as Bluebird from 'bluebird';

import { Component, ReactNode } from 'react';

import { Nullable } from '../../../helper/type';

export interface BattleResultsProps {

}

export interface BattleResultsProgress {
	title: Nullable<string>;
	description: Nullable<string>;

	progress: Nullable<number>;
}

enum BattleResultsPage {
	SelfStats,
	PlayerList
}

export interface BattleResultsState {
	visible: boolean;

	page: BattleResultsPage;

	stats: Nullable<any>;
	results: Nullable<any>;
}

export class BattleResults extends Component<BattleResultsProps, BattleResultsState> {
	public constructor(props: BattleResultsProps) {
		super(props);

		this.state = {
			visible: false,
			
			page: BattleResultsPage.SelfStats,

			stats: null,
			results: null
		};
	}

	public async componentDidMount(): Promise<void> {
		
	}

	public async setResults(stats: any, results: any): Promise<void> {
		this.setState({
			visible: false,

			page: BattleResultsPage.SelfStats,

			stats: stats,
			results: results
		});
	}

	public async show(): Promise<void> {
		if(this.state.visible) return;

		this.setState({
			visible: false
		});
	}

	public async hide(): Promise<void> {
		if(!this.state.visible) return;

		this.setState({
			visible: false
		});
	}

	public render(): ReactNode {
		if(!this.state.visible) return null;

		return (
			<div className="bt-battle-results">
				<div className="bt-players">
					<div className="bt-player">
					</div>
				</div>
			</div>
		);
	}
}
