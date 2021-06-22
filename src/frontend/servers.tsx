import * as Bluebird from 'bluebird';
import * as React from 'react';
import * as _ from 'lodash';

import { Provider } from 'react-redux';
import { List } from '@assasans/storage';
import { Component, ReactNode } from 'react';
import { RouteComponentProps, BrowserRouter as Router, withRouter } from 'react-router-dom';

import { Store } from './store';
import { Nullable } from '../helper/type';
import { TestServer, MainServer, ServerHelper, MainEuropeServer } from '../helper/servers';
import { BuildMode, Runtime } from '../runtime';
import { DateTime, Duration } from 'luxon';
import { CheckBox } from './control/checkbox';
import { TextEdit } from './control/textedit';
import { SettingsSection } from './control/settings/section';

import { ModalStackView } from './modal/stack';
import { PluginListView } from './plugins/list';
import { PluginFilterView } from './plugins/filter';
import { NotificationListView } from './notification/list';
import { Plugin, PluginFlags } from '../model/plugin/plugin';
import { addModal, addNotifcation, addPlugin, deleteModal } from './actions';
import { ListView } from './control/list/list';
import { ListItemView } from './control/list/item';
import { ButtonView } from './control/button/button';
import { ButtonGroupView } from './control/button/group';
import { Notification, NotificationLevel, NotificationTitle } from '../model/notification/notification';
import { TreeView } from './control/tree/tree';
import { TreeNodeView } from './control/tree/node';
import { BorderlessButtonView } from './control/button/borderless';
import { FilledButtonView } from './control/button/filled';
import { ImageView } from './control/image';
import { ProgressBarView } from './control/progress/progress';
import { CircularProgressBarView } from './control/progress/circular';

window.Store = Store;

export interface ServersProps extends RouteComponentProps {

}

export interface ServersState {
	europeServers: MainServer[];
	chinaServers: MainServer[];

	testServers: TestServer[];

	zoomIn: boolean;
	bounce: boolean;

	fadeOut: boolean;
	fadeOutContainer: boolean;

	visible: boolean;
	visibleContainer: boolean;

	loadingState: Nullable<string>;
	loadingDetails: Nullable<string>;
}

export class Servers extends Component<ServersProps, ServersState> {
	private updateInterval: Nullable<NodeJS.Timeout>;

	public constructor(props: ServersProps) {
		super(props);

		this.state = {
			europeServers: [],
			chinaServers: [],

			testServers: [],

			zoomIn: false,
			bounce: false,

			fadeOut: false,
			fadeOutContainer: false,

			visible: true,
			visibleContainer: true,

			loadingState: null,
			loadingDetails: null
		};

		this.updateInterval = null;

		this.onClickMain = this.onClickMain.bind(this);
		this.onClickTest = this.onClickTest.bind(this);
	}

	public async componentDidMount(): Promise<void> {
		Store.dispatch(addPlugin(new Plugin({
			id: DateTime.local().toMillis(),
			name: 'Indev',
			author: 'Assasans',
			version: 'v1.0.0',
			description: 'Hello from Redux: a state management library',
			flags: new PluginFlags([
				// PluginFlags.FLAGS
			])
		})));

		Store.dispatch(addPlugin(new Plugin({
			id: DateTime.local().toMillis() + 1,
			name: 'BTMM',
			author: 'Assasans',
			version: 'v1.2.3',
			description: 'Better Matchmaking',
			flags: new PluginFlags([
				// PluginFlags.FLAGS
			])
		})));

		Store.dispatch(addPlugin(new Plugin({
			id: DateTime.local().toMillis() + 2,
			name: 'VoiceChat',
			author: 'Assasans',
			version: 'v2.2.8',
			description: 'In-battle voice chat',
			flags: new PluginFlags([
				// PluginFlags.FLAGS
			])
		})));

		/* Store.dispatch(addNotifcation(new Notification({
			id: DateTime.local().toMillis(),
			title: new NotificationTitle({
				icon: <img src="https://cdn.discordapp.com/emojis/748995951351300106.png" />,
				text: <span>React Redux 1</span>
			}),
			description: <span>Hello from Redux: a state management library</span>,
			duration: 2000,
			level: NotificationLevel.Info,
			hidden: false
		})));

		const id = DateTime.local().toMillis();

		Store.dispatch(addModal(new Modal({
			id: id,
			title: new ModalTitle({
				icon: <img src="https://cdn.discordapp.com/emojis/748995951351300106.png" />,
				text: <span>React Redux 1</span>
			}),
			description: (
				<>
					<span>Hello from Redux: a state management library</span>
					<ModalButtonGroupView style={{
						marginTop: '0.5em'
					}}>
						<ModalButtonView onClick={(component) => {
							Store.dispatch(deleteModal({
								id: id
							}));

							Store.dispatch(addNotifcation(new Notification({
								id: DateTime.local().toMillis(),
								title: new NotificationTitle({
									icon: <img src="https://cdn.discordapp.com/emojis/811327873649737759.png" />,
									text: <span>Модальное окно</span>
								}),
								description: <span>Вы выбрали: {component.props.children}</span>,
								duration: 2000,
								level: NotificationLevel.Info,
								hidden: false
							})));
						}}>Выебать jQuery</ModalButtonView>

						<ModalButtonView onClick={(component) => {
							Store.dispatch(deleteModal({
								id: id
							}));

							Store.dispatch(addNotifcation(new Notification({
								id: DateTime.local().toMillis(),
								title: new NotificationTitle({
									icon: <img src="https://cdn.discordapp.com/emojis/811327873649737759.png" />,
									text: <span>Анонимус</span>
								}),
								description: <div>
									<span>Да</span><br />
									<img src="https://i.pinimg.com/originals/99/89/5e/99895ef0b3fe95ba66d32b90fe2207ec.jpg" style={{maxWidth: '20em'}} />
								</div>,
								duration: 5000,
								level: NotificationLevel.Warn,
								hidden: false
							})));
						}}>Инфа о Ассасансе</ModalButtonView>
					</ModalButtonGroupView>
				</>
			),
			level: ModalLevel.Info
		}))); */

		/* this.setState({
			fadeOutContainer: false,
			visibleContainer: false
		});
		return; */

		(async () => {
			this.setState({
				loadingState: 'Загрузка...'
			});

			// await Bluebird.delay(2500);

			this.setState({
				loadingState: 'Обновление серверов...'
			});

			let isLoaded: boolean = false;
			let retry: number = 0;

			do {
				try {
					await this.updateServers();

					isLoaded = true;
				} catch(_error) {
					console.error(_error);

					const error: Error = _error;

					retry++;
					const retryAfter: Duration = Duration.fromMillis(retry * 2 * 1000);

					this.setState({
						loadingState: `Произошла ошибка: ${error.name}: ${error.message}`
					});

					for(let left: number = retryAfter.shiftTo('second').seconds; left >= 0; left--) {
						const leftDuration: Duration = Duration.fromMillis(left * 1000);

						this.setState({
							loadingDetails: `Повтор через: ${leftDuration.toFormat('mm:ss')}`
						});

						await Bluebird.delay(1000);
					}
				}
			} while(!isLoaded);

			this.setState({
				loadingState: 'Сервера обновлены'
			});

			this.updateInterval = setInterval(async () => {
				await this.updateServers();
			}, 5000);

			await Bluebird.delay(500);

			await this.fadeOut();
		})();

		this.setState({
			zoomIn: true,
			bounce: false
		});

		await Bluebird.delay(1500);

		this.setState({
			zoomIn: false,
			bounce: true
		});
	}

	public async fadeOut(): Promise<void> {
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

		await Bluebird.delay(1000);

		this.setState({
			fadeOutContainer: false,
			visibleContainer: false
		});
	}

	public componentWillUnmount(): void {
		if(this.updateInterval !== null) {
			clearInterval(this.updateInterval);
		}
	}

	private async updateServers(): Promise<void> {
		const europeServers: List<MainServer> = await ServerHelper.getMainServersEurope();
		const chinaServers: List<MainServer> = await ServerHelper.getMainServersChina();
		const testServers: List<TestServer> = await ServerHelper.getTestServers();

		this.setState({
			europeServers: europeServers.array(),
			chinaServers: chinaServers.array(),

			testServers: testServers.array()
		});
	}

	private onClickMain(component: MainServerItem): void {
		const {
			name,
			host, url
		}: MainServerProps = component.props;

		console.log(`Connecting to ${name}: ${host}`);
		location.replace(url);
	}

	private onClickTest(component: TestServerItem): void {
		const {
			name,
			host, url
		}: TestServerProps = component.props;

		console.log(`Connecting to ${name}: ${host}`);
		location.replace(url);
	}

	private onClickUnavailable(component: UnavailableServerItem): void {
		const {}: UnavailableServerProps = component.props;
	}

	public render(): ReactNode {
		const {
			europeServers, chinaServers,
			testServers
		}: ServersState = this.state;

		setTimeout(() => {
			this.forceUpdate();
		}, 150);

		const _europeServers: MainServer[] = europeServers.slice(0, 2);
		const chinaServer: Nullable<MainServer> = chinaServers[0] ?? null;

		const testOnline: number = _.sum(testServers.map((server: TestServer) => server.online));

		return (
			<Provider store={Store}>
				<Router>
					<link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
					<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap" rel="stylesheet" />

					<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round" rel="stylesheet" />

					<div className="bt-background">
						{/* <video className="bt-background-video" preload="auto" autoPlay={true} loop={true} muted={true}>
							<source src="https://new-ru.tankionline.com/wp-content/themes/tanki20/video/main.mp4" type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;" />
							Your browser does not support the video tag.
						</video> */}
						<img className="bt-background-image" src="https://pbs.twimg.com/media/CMEgqgVUMAEVrrv?format=png&name=large" />
					</div>

					<div className="bt-notifications">
						<NotificationListView />
					</div>

					<div className="bt-modals">
						<ModalStackView />
					</div>

					{this.state.visibleContainer ? (
						<div className={`bt-welcome-container${this.state.fadeOutContainer ? ' bt-welcome-container--fade-out' : ''}`}>
							<div className={`bt-welcome-wrapper${this.state.zoomIn ? ' bt-welcome-wrapper--zoom-in' : ''}${this.state.bounce && this.state.fadeOut ? ' bt-welcome-wrapper--bounce-fade-out' : ''}${!this.state.fadeOut && this.state.bounce ? ' bt-welcome-wrapper--bounce' : ''}${!this.state.bounce && this.state.fadeOut ? ' bt-welcome-wrapper--fade-out' : ''}`}>
								{this.state.visible ? (
									<>
										<span className="bt-welcome">Welcome to BetterTanki</span>

										{this.state.loadingState !== null ? (
											<span className="bt-welcome-state">{this.state.loadingState}</span>
										) : null}

										{this.state.loadingDetails !== null ? (
											<span className="bt-welcome-details">{this.state.loadingDetails}</span>
										) : null}

										{/* <span className="bt-welcome-state" style={{
											marginTop: '1em',
											fontSize: '0.8em'
										}}>Исходный код доступен на: <span style={{
											color: '#1e88e5'
										}}>https://github.com/better-tanki</span></span> */}
									</>
								) : null}
							</div>
						</div>
					) : null}

					<div className="bt-title-container">
						<div>
							<span className="bt-title">BetterTanki</span>
							{/* <span className="bt-title-description"></span> */}
						</div>
						<div>
							<span className="bt-version">
								BT
								{Runtime.get().mode === BuildMode.Development
									? 'Dev'
									: Runtime.get().mode === BuildMode.ClosedBeta
									? 'CB'
									: Runtime.get().mode === BuildMode.OpenBeta
									? 'OB'
									: Runtime.get().mode === BuildMode.Production
									? 'Rel'
									: 'Unknown'}
								{Runtime.get().version}
							</span>
							{/* <span className="bt-version-value">{Runtime.get().version}</span> */}
							{/* <span className="bt-version-description">Closed beta</span> */}
						</div>
					</div>

					<div className="bt-server-list">
						<div className="bt-servers-group">
							<div className="bt-servers-group__header">
								<span className="bt-servers-group__name">Основные сервера</span>
							</div>

							<div className="bt-servers bt-servers--main">
								{_europeServers.map((europeServer: MainEuropeServer) => (
									<MainServerItem
										key={europeServer.host}

										title="Европейские сервера"

										name={europeServer.name}
										host={europeServer.host}
										url={europeServer.url}

										// online={_.sum(europeServers.map((server: MainServer) => server.online))}
										// inBattles={_.sum(europeServers.map((server: MainServer) => server.inBattles))}

										online={europeServer.host.includes('tankionline.com') ? _.sum(europeServers.slice(1).map((server: MainServer) => server.online)) : europeServer.online}
										inBattles={europeServer.host.includes('tankionline.com') ? _.sum(europeServers.slice(1).map((server: MainServer) => server.inBattles)) : europeServer.online}

										onClick={this.onClickMain} />
								))}

								{/* <UnavailableServerItem
									onClick={this.onClickUnavailable} /> */}

								{chinaServer ? (
									<MainServerItem
										title="Китайские сервера"

										name={chinaServer.name}
										host={chinaServer.host}
										url={chinaServer.url}

										online={_.sum(chinaServers.map((server: MainServer) => server.online))}
										inBattles={_.sum(chinaServers.map((server: MainServer) => server.inBattles))}

										onClick={this.onClickMain} />
								) : (
									<UnavailableServerItem
										onClick={this.onClickUnavailable} />
								)}
							</div>
						</div>

						<div className="bt-servers-group">
							<div className="bt-servers-group__header">
								<span className="bt-servers-group__name">Тестовые сервера</span>
								<div className="bt-servers-group__state">
									<span className="bt-servers-group__online">Онлайн: <span className="bt-servers-group__online-value">{testOnline.toLocaleString('ru')}</span></span>
								</div>
							</div>

							<div className="bt-servers bt-servers--test">
								{this.state.testServers.map((server: TestServer, index: number) => (
									<TestServerItem
										key={index}

										title={`Тестовый сервер ${index + 1}`}

										name={server.name}
										host={server.host}
										url={server.url}

										online={server.online}

										onClick={this.onClickTest} />
								))}
							</div>
						</div>
					</div>

					{/* {/* <div className="bt-test">
						<ButtonView>alo</ButtonView>
						<ButtonView>Взломать казино</ButtonView>
					</div> */}

					<div className="bt-test">
					</div>

					<div className="bt-test">
						<ButtonGroupView>
							<FilledButtonView onClick={() => {
								Store.dispatch(addNotifcation(new Notification({
									id: DateTime.local().toMillis(),
									title: new NotificationTitle({
										icon: <img src="https://cdn.discordapp.com/emojis/811327873649737759.png" />,
										text: <span>Взлом казино 1</span>
									}),
									description: <>
										<span>Взлом казино не удался!</span>
										<span>Вас нашли ФСБ!</span>
									</>,
									duration: 5000,
									level: NotificationLevel.Error,
									hidden: false
								})));
							}}>Взломать казино</FilledButtonView>
							<ButtonView onClick={() => {
								Store.dispatch(addNotifcation(new Notification({
									id: DateTime.local().toMillis(),
									title: new NotificationTitle({
										icon: <img src="https://cdn.discordapp.com/emojis/811327873649737759.png" />,
										text: <span>Взлом казино 2</span>
									}),
									description: <>
										<span>Взлом казино не удался!</span>
										<span>Вас нашли ФСБ!</span>
									</>,
									duration: 5000,
									level: NotificationLevel.Error,
									hidden: false
								})));
							}}>Взломать казино</ButtonView>
							<BorderlessButtonView onClick={() => {
								Store.dispatch(addNotifcation(new Notification({
									id: DateTime.local().toMillis(),
									title: new NotificationTitle({
										icon: <img src="https://cdn.discordapp.com/emojis/811327873649737759.png" />,
										text: <span>Взлом казино 3</span>
									}),
									description: <>
										<span>Взлом казино не удался!</span>
										<span>Вас нашли ФСБ!</span>
									</>,
									duration: 5000,
									level: NotificationLevel.Error,
									hidden: false
								})));
							}}>Взломать казино</BorderlessButtonView>
						</ButtonGroupView>
					</div>

					<div className="bt-test">
					</div>

					{/* <div className="bt-test">
						<ListView>
							<ListItemView>item 1</ListItemView>
							<ListItemView>item 2</ListItemView>
							<ListItemView>item 3</ListItemView>
							<ListItemView>item 4</ListItemView>
							<ListItemView>item 5</ListItemView>
						</ListView>
					</div>*/}

					<div className="bt-test">
						<TreeView>
							<TreeNodeView title="Root" root={true}>
								<TreeNodeView title="Item" />
								<TreeNodeView title="Branch">
									<TreeNodeView title="Branch -> item" />
									<TreeNodeView title="Cursed">
										<TreeNodeView title="Service">
											<TreeNodeView title={<><ImageView src="https://cdn.discordapp.com/emojis/811327873649737759.png" /><br />Desktop</>} />
										</TreeNodeView>
										<TreeNodeView title="Backdoor" />
									</TreeNodeView>
								</TreeNodeView>
							</TreeNodeView>
						</TreeView>
					</div>

					{/* <div className="bt-test">
						<PluginFilterView />
						<PluginListView />
					</div> */}

					<div className="bt-test">
						<SettingsSection title="Section title">
							<div>Checkbox: <CheckBox checked={false} /></div>
							<div>Textedit: <TextEdit /></div>
						</SettingsSection>
					</div>

					<div className="bt-test">
						<div>Implicit unchecked: <CheckBox /></div>
						<div>Explicit unchecked: <CheckBox checked={false} /></div>
						<div>Checked: <CheckBox checked={true} /></div>
					</div>

					<div className="bt-test">
						<div>Default: <TextEdit /></div>
						<div>Placeholder: <TextEdit placeholder="This is a placeholder!" /></div>
						<div>Text: <TextEdit defaultValue="Example text" /></div>
					</div>

					{/* <div className="bt-test">
						<div>Dropdown: <Dropdown items={List.fromArray([
							'Item 1',
							'Item 2',
							'Item 3',
							'Item 4',
							'Item 5'
						])} /></div>
					</div> */}
				</Router>
			</Provider>
		);
	}
}

export default withRouter(Servers);

export interface MainServerProps {
	title: string;

	name: string;
	host: string;
	url: string;

	online: number;
	inBattles: number;

	onClick?: (component: MainServerItem) => void;
}

export interface MainServerState {
}

export class MainServerItem extends Component<MainServerProps, MainServerState> {
	private onClick: Nullable<(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>;

	public constructor(props: MainServerProps) {
		super(props);

		this.state = {
		};

		this.onClick = this.props.onClick?.bind(this, this) ?? null;
	}

	public render(): ReactNode {
		const {
			title,
			name, host,
			online, inBattles
		}: MainServerProps = this.props;

		return (
			<div
				className="bt-server bt-server--main"
				onClick={this.onClick ?? undefined}
			>
				<div className="bt-server-side">
					<span className="bt-server-title">{title}</span>

					<span className="bt-server-host">[Debug] Сервер: <span className="bt-server-host-value">{name}</span></span>
					<span className="bt-server-host">[Debug] Хост: <span className="bt-server-host-value">{host}</span></span>
				</div>

				<div className="bt-server-side bt-server-side--right">
					<span className="bt-server-online">Онлайн: <span className="bt-server-online-value">{online.toLocaleString('ru')}</span></span>
					<span className="bt-server-online">В битвах: <span className="bt-server-online-value">{inBattles.toLocaleString('ru')}</span></span>
				</div>
			</div>
		);
	}
}

/* Test server */

export interface TestServerProps {
	title: string;

	name: string;
	host: string;
	url: string;

	online: number;

	onClick?: (component: TestServerItem) => void;
}

export interface TestServerState {
}

export class TestServerItem extends Component<TestServerProps, TestServerState> {
	private onClick: Nullable<(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>;

	public constructor(props: TestServerProps) {
		super(props);

		this.state = {
		};

		this.onClick = this.props.onClick?.bind(this, this) ?? null;
	}

	public render(): ReactNode {
		const {
			title,
			name, host,
			online
		}: TestServerProps = this.props;

		return (
			<div
				className="bt-server bt-server--test"
				onClick={this.onClick ?? undefined}
			>
				<div className="bt-server-side">
					<span className="bt-server-title">{title}</span>

					<span className="bt-server-host">Сервер: <span className="bt-server-host-value">{name}</span></span>
					<span className="bt-server-host">Хост: <span className="bt-server-host-value">{host}</span></span>
				</div>

				<div className="bt-server-side bt-server-side--right">
					<span className="bt-server-online">Онлайн: <span className="bt-server-online-value">{online.toLocaleString('ru')}</span></span>
				</div>
			</div>
		);
	}
}

/* Unavailable server */

export interface UnavailableServerProps {
	onClick?: (component: UnavailableServerItem) => void;
}

export interface UnavailableServerState {
}

export class UnavailableServerItem extends Component<UnavailableServerProps, UnavailableServerState> {
	private onClick: Nullable<(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>;

	public constructor(props: UnavailableServerProps) {
		super(props);

		this.state = {
		};

		this.onClick = this.props.onClick?.bind(this, this) ?? null;
	}

	public render(): ReactNode {
		const {}: UnavailableServerProps = this.props;

		return (
			<div
				className="bt-server bt-server--unavailable"
				onClick={this.onClick ?? undefined}
			>
				<div className="bt-server-side">
					<span className="bt-server-title">Сервер недоступен</span>
				</div>
			</div>
		);
	}
}
