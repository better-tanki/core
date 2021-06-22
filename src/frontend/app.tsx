import * as Classname from 'classnames';
import * as React from 'react';

import { DateTime, Duration } from 'luxon';
import { BrowserRouter as Router } from 'react-router-dom';
import { Component, RefObject, ReactNode, ComponentClass } from 'react';

import { Console } from './gui';
import { Preload } from './preload';
import { Loading } from './loading';
import { Settings } from './settings';
import { BattleResults } from './window/battle/results';

import { PluginErrorBoundary } from './component/error-boundary';

import { Nullable } from '../helper/type';

export interface AppProps {

}

export interface AppState {
	plugins: ComponentClass<{}>[];

	_lastReceived: Nullable<DateTime>;
	_lastSent: Nullable<DateTime>;

	_lastReceivedMs: Nullable<number>;
	_lastSentMs: Nullable<number>;

	lastReceived: Nullable<string>;
	lastSent: Nullable<string>;
}

export class App extends Component<AppProps, AppState> {
	public preloader: RefObject<Preload>;
	public loading: RefObject<Loading>;

	public settings: RefObject<Settings>;
	public console: RefObject<Console>;

	public battleResults: RefObject<BattleResults>;

	public constructor(props: AppProps) {
		super(props);

		this.preloader = React.createRef();
		this.loading = React.createRef();

		this.settings = React.createRef();
		this.console = React.createRef();

		this.battleResults = React.createRef();

		this.state = {
			plugins: [],

			_lastReceived: null,
			_lastSent: null,

			_lastReceivedMs: null,
			_lastSentMs: null,

			lastReceived: null,
			lastSent: null
		};
	}

	public componentDidMount(): void {
		// window.events.on('receive', (lastReceived: DateTime) => {
		// 	this.setState({
		// 		_lastReceived: lastReceived
		// 	});
		// });

		// window.events.on('send', (lastSent: DateTime) => {
		// 	this.setState({
		// 		_lastSent: lastSent
		// 	});
		// });

		// setInterval(() => {
		// 	const receivedDifference: Nullable<Duration> = this.state._lastReceived ? DateTime.now().diff(this.state._lastReceived).shiftTo('seconds', 'milliseconds') : null;
		// 	const sentDifference: Nullable<Duration> = this.state._lastSent ? DateTime.now().diff(this.state._lastSent).shiftTo('seconds', 'milliseconds') : null;

		// 	this.setState({
		// 		lastReceived: receivedDifference ? receivedDifference.seconds > 0 ? `${receivedDifference.seconds}.${receivedDifference.milliseconds / 100 | 0} s` : `${receivedDifference.milliseconds} ms` : null,
		// 		_lastReceivedMs: receivedDifference ? receivedDifference.shiftTo('milliseconds').milliseconds : null,

		// 		lastSent: sentDifference ? sentDifference.seconds > 0 ? `${sentDifference.seconds}.${sentDifference.milliseconds / 100 | 0} s` : `${sentDifference.milliseconds} ms` : null,
		// 		_lastSentMs: sentDifference ? sentDifference.shiftTo('milliseconds').milliseconds : null
		// 	});
		// }, 10);
	}

	public addPlugin(component: ComponentClass<{}>): void {
		this.setState({
			plugins: [
				...this.state.plugins,
				component
			]
		});
	}

	public render(): ReactNode {
		return (
			<Router>
				<link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,300;1,400;1,500;1,600;1,700;1,900&display=swap" rel="stylesheet" />

				<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round" rel="stylesheet" />
				
				{/* <Preload ref={this.preloader} /> */}
				<Loading ref={this.loading} />

				<Settings ref={this.settings} />

				<Console ref={this.console} />

				<BattleResults ref={this.battleResults} />

				{/* <Plugins /> */}

				{this.state.plugins.map((component: ComponentClass<{}>, index: number) => (
					<PluginErrorBoundary key={index}>
						{component}
					</PluginErrorBoundary>
				))}

				{/* <div className="timers">
					<div className="timer">
						<span className="timer-name">Последний принятый пакет:</span>
						{this.state.lastReceived && this.state._lastReceivedMs !== null ? (
							<span className={Classname('timer-value', {
								'timer-value--normal': this.state._lastReceivedMs < 2000,
								'timer-value--warning': this.state._lastReceivedMs > 2000 && this.state._lastReceivedMs < 50000,
								'timer-value--danger': this.state._lastReceivedMs > 5000,
							})}>{this.state.lastReceived}</span>
						) : (
							<span className="timer-value timer-value--error">неизвестно</span>
						)}
					</div>

					<div className="timer">
						<span className="timer-name">Последний отправленный пакет:</span>
						{this.state.lastSent && this.state._lastSentMs !== null ? (
							<span className={Classname('timer-value', {
								'timer-value--normal': this.state._lastSentMs < 2000,
								'timer-value--warning': this.state._lastSentMs > 2000 && this.state._lastSentMs < 50000,
								'timer-value--danger': this.state._lastSentMs > 5000,
							})}>{this.state.lastSent}</span>
						) : (
							<span className="timer-value timer-value--error">неизвестно</span>
						)}
					</div>
				</div> */}
			</Router>
		);
	}
}
