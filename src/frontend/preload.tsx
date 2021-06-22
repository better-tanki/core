import * as React from 'react';
import * as Bluebird from 'bluebird';

import { Component, ReactNode } from 'react';

import { ProgressBar } from './component/progress';

import { Nullable } from '../helper/type';

export interface PreloadProps {

}

export interface LoadingProgress {
	title: Nullable<string>;
	subtitle: Nullable<string>;

	progress: number;
}

export interface PreloadState {
	visible: boolean;
	loading: LoadingProgress;

	fadingOut: boolean;
}

export class Preload extends Component<PreloadProps, PreloadState> {
	public constructor(props: PreloadProps) {
		super(props);

		this.state = {
			visible: true,
			loading: {
				title: null,
				subtitle: null,
				progress: 0
			},

			fadingOut: false
		};
	}

	public async componentDidMount(): Promise<void> {
		const preloader: HTMLDivElement = document.querySelector('div#root')! as HTMLDivElement;
		const observer: MutationObserver = new MutationObserver(async (mutations: MutationRecord[]) => {
			console.log(mutations);

			const removeMutation: Nullable<MutationRecord> = mutations[0] ?? null;
			const addMutation: Nullable<MutationRecord> = mutations[1] ?? null;

			if(!removeMutation || !addMutation) return;
			
			const removedElement: Nullable<HTMLDivElement> = (removeMutation.removedNodes[0] ?? null) as Nullable<HTMLDivElement>;
			const addedElement: Nullable<HTMLDivElement> = (addMutation.addedNodes[0] ?? null) as Nullable<HTMLDivElement>;
			
			if(!removedElement) return;
			// if(!removedElement || !addedElement) return;

			console.log(removedElement);
			console.log(addedElement);

			// if(
			// 	removedElement.getAttribute('data-style') === 'ApplicationComponentStyle-container Common-background' &&
			// 	(addedElement.getAttribute('data-style') === 'Common-content Common-background' || addedElement.getAttribute('data-style') === 'Common-container')
			// ) {
			if(
				// removedElement.getAttribute('data-style') === 'ApplicationComponentStyle-container Common-background' || // Auth menu
				addedElement instanceof HTMLCanvasElement || // Main menu
				addedElement === null
			) {
				await Bluebird.delay(500);

				console.log('HIDE!')
				this.setState({
					visible: false,

					fadingOut: true
				});

				await Bluebird.delay(1500);

				this.setState({
					visible: false,

					fadingOut: false
				});
			}
		});

		observer.observe(preloader, {
			childList: true
		});
	}

	public setLoading(loading: LoadingProgress): this {
		this.setState({
			loading: loading
		})
		return this;
	}

	public render(): ReactNode {
		if(!this.state.visible && !this.state.fadingOut) return null;

		return (
			<div className={`bt-preloader${this.state.fadingOut ? ' preload-fade-out' : ''}`}>
				<div className="bt-background">
					<img className="bt-background" src="https://xtanki.ru/Photo/Wallpaper/TankiX_Wallpaper_City%20battle.jpg" />
				</div>

				<div className="preloader">
					<div className="bt-preload__text-loading">Загрузка...</div>

					{this.state.loading.title ? (
						<div className="bt-preload__text-loading bt-preload__text-loading-module">{this.state.loading.title}</div>
					) : null}
					
					{this.state.loading.subtitle ? (
						<div className="bt-preload__text-loading bt-preload__text-loading-module">{this.state.loading.subtitle}</div>
					) : null}

					<ProgressBar progress={this.state.loading.progress} />
				</div>
			</div>
		);
	}
}
