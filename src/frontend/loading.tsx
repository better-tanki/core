import * as React from 'react';
import * as Bluebird from 'bluebird';

import { Component, ReactNode } from 'react';

import { Nullable } from '../helper/type';

export interface LoadingProps {

}

export interface LoadingProgress {
	title: Nullable<string>;
	description: Nullable<string>;

	progress: Nullable<number>;
}

export interface LoadingState {
	originalLoaderVisible: boolean;

	zoomIn: boolean;
	bounce: boolean;

	fadeInContainer: boolean;

	fadeOut: boolean;
	fadeOutContainer: boolean;

	_visible: boolean;
	visible: boolean;
	visibleContainer: boolean;

	progress: Nullable<LoadingProgress>;
}

export class Loading extends Component<LoadingProps, LoadingState> {
	private interval: Nullable<NodeJS.Timeout>;

	public constructor(props: LoadingProps) {
		super(props);

		this.state = {
			originalLoaderVisible: false,
			
			zoomIn: false,
			bounce: false,

			fadeInContainer: false,

			fadeOut: false,
			fadeOutContainer: false,

			_visible: false,
			visible: false,
			visibleContainer: false,

			progress: null
		};

		this.interval = null;
	}

	public async componentDidMount(): Promise<void> {
		// const preloader: HTMLDivElement = document.querySelector('div#root')! as HTMLDivElement;
		// const observer: MutationObserver = new MutationObserver(async (mutations: MutationRecord[]) => {
		// 	const added: HTMLElement[] = mutations.map((mutation: MutationRecord) => Array.from(mutation.addedNodes) as HTMLElement[]).flat();
		// 	const removed: HTMLElement[] = mutations.map((mutation: MutationRecord) => Array.from(mutation.removedNodes) as HTMLElement[]).flat();

		const _handle = async (added: HTMLElement[], removed: HTMLElement[]): Promise<void> => {
			if(
				added.some((element: HTMLElement) => {
					return (
						element.getAttribute('data-style') === 'ApplicationComponentStyle-container Common-background'
						// element.getAttribute('data-style') === 'LobbyLoaderStyle-container'
					);
				}) ||
				removed.some((element: HTMLElement) => {
					return (
						false
					);
				})
			) {
				await Bluebird.delay(500);

				console.log(added);

				this.fadeIn();
			}

			if(
				added.some((element: HTMLElement) => {
					return (
						element.getAttribute('data-style') === 'Style-canvasContainer' ||
						element.getAttribute('data-style') === 'Common-container'
					);
				}) ||
				removed.some((element: HTMLElement) => {
					return (
						element.getAttribute('data-style') === 'ApplicationComponentStyle-container Common-background' ||
						element.getAttribute('data-style') === 'LobbyLoaderStyle-container'
					);
				})
			) {
				await Bluebird.delay(500);

				this.fadeOut();
			}
		};

		// observer.observe(preloader, {
		// 	childList: true
		// });
		
		Node.prototype.__appendChild = Node.prototype.appendChild;
		Node.prototype.appendChild = function appendChild<T extends Node>(this: Node, newChild: T): T {
			const child: T = this.__appendChild(newChild);

			if(newChild instanceof HTMLElement) {
				// console.log('add', newChild);
				_handle([ newChild ], []);
			}

			return child;
		};
		
		Node.prototype.__removeChild = Node.prototype.removeChild;
		Node.prototype.removeChild = function removeChild<T extends Node>(this: Node, oldChild: T): T {
			const child: T = this.__removeChild(oldChild);

			if(oldChild instanceof HTMLElement) {
				// console.log('remove', oldChild);
				_handle([], [ oldChild ]);
			}

			return child;
		};

		const instance: this = this;

		let debouncing: Nullable<NodeJS.Timeout> = null;

		Object.defineProperty(Object.prototype, 'lobbyLoader', {
			get: function(this: any): any {
				return this._isShowLoader;
			},
			set: function(this: any, value: any): any {
				if(Bt.Internals.TankiStore.state.system.fatalError) return;

				if(value.isShowLoader) {
					// console.log('Debouncing: caught show');
					if(!debouncing) {
						// console.log('Debouncing started...');
						debouncing = setTimeout(() => {
							debouncing = null;

							instance.setState({
								originalLoaderVisible: true
							});

							console.log('Debouncing: passed');
			
							instance.fadeIn();

							// console.log('Fade in called');
						}, 50);
					}
				} else {
					// console.log('Debouncing: caught hide');
					if(debouncing) {
						clearTimeout(debouncing);
						debouncing = null;

						// console.log('Debouncing: canceled');
					} else {
						if(instance.state.originalLoaderVisible) {
							instance.setState({
								originalLoaderVisible: false
							});

							instance.fadeOut();

							// console.log('Fade out called');
						}
					}
				}

				this._isShowLoader = value;
			},
			enumerable: false,
			configurable: true
		});
	}

	public async fadeIn(): Promise<void> {
		if(this.state._visible) return;

		console.log('Show!');

		this.setState({
			_visible: true
		});

		this.setProgress({
			title: 'Загрузка...',
			description: ':watafak:',

			progress: 0
		});

		this.setState({
			fadeInContainer: true,

			visibleContainer: true
		});

		await Bluebird.delay(500);

		this.setState({
			fadeInContainer: false
		});

		let progress: number = 0;

		if(this.interval !== null) clearInterval(this.interval);
		this.interval = setInterval(() => {
			if(progress >= 100) progress = 0;

			progress += 0.1;

			this.setProgress({
				title: 'Загрузка...',
				description: `${progress.toFixed(0)}%`,

				progress: progress
			});
		}, 10);

		this.setState({
			zoomIn: true,

			visible: true,
			visibleContainer: true
		});

		await Bluebird.delay(1500);

		this.setState({
			zoomIn: false,
			bounce: true
		});
	}

	public async fadeOut(): Promise<void> {
		if(!this.state._visible) return;

		console.log('Hide!');

		this.setState({
			_visible: false
		});

		if(this.interval !== null) clearInterval(this.interval);

		this.setState({
			zoomIn: false,
			bounce: true,
			fadeOut: true
		});

		(async () => {
			await Bluebird.delay(1000);

			this.setState({
				bounce: false,
				fadeOut: false,
				visible: false
			});
		})();

		await Bluebird.delay(500);

		this.setState({
			fadeOutContainer: true
		});

		await Bluebird.delay(500);

		this.setState({
			fadeOutContainer: false,
			visibleContainer: false
		});
	}

	public setProgress(progress: LoadingProgress): void {
		this.setState({
			progress: progress
		});
	}

	public render(): ReactNode {
		if(!this.state.visibleContainer) return null;

		return (
			<div className="bt-loading">
				{/* <div className="bt-loading-background">
					<img className="bt-loading-background" src="https://xtanki.ru/Photo/Wallpaper/TankiX_Wallpaper_City%20battle.jpg" />
				</div> */}

				<div className={`bt-loading-container${this.state.fadeInContainer ? ' bt-loading-container--fade-in' : ''}${this.state.fadeOutContainer ? ' bt-loading-container--fade-out' : ''}`}>
					<div className={`bt-loading-wrapper${this.state.zoomIn ? ' bt-loading-wrapper--zoom-in' : ''}${this.state.bounce && this.state.fadeOut ? ' bt-loading-wrapper--bounce-fade-out' : ''}${!this.state.fadeOut && this.state.bounce ? ' bt-loading-wrapper--bounce' : ''}${!this.state.bounce && this.state.fadeOut ? ' bt-loading-wrapper--fade-out' : ''}`}>
						{this.state.visible && this.state.progress ? (
							<>
								{this.state.progress.title !== null ? (
									<span className="bt-loading-title">{this.state.progress.title}</span>
								) : null}

								{this.state.progress.description !== null ? (
									<span className="bt-loading-description">{this.state.progress.description}</span>
								) : null}
							</>
						) : null}
					</div>
				</div>

				{this.state.progress && this.state.progress.progress !== null ? (
					<div className={`bt-loading-progress-container${this.state.fadeOutContainer ? ' bt-loading-progress-container--fade-out' : ''}`}>
						<div className="bt-loading-progress">
							<div className="bt-loading-progress-filled" style={{
								width: `${this.state.progress.progress.toFixed(2)}%`
							}}></div>
						</div>
					</div>
				) : null}
			</div>
		);
	}
}
