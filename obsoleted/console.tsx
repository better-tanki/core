// Original location: src/frontend/console.tsx

import * as DOMPurify from 'dompurify';
import * as Bluebird from 'bluebird';
import * as XRegExp from 'xregexp';
import * as React from 'react';

import { List } from '@assasans/storage';
import { Component, ReactNode, RefObject } from 'react';

import { Runtime } from '../runtime';
import { Nullable } from '../helper/type';
import { ManuallyInitiatedCrashException } from '../error/exception';

export interface ConsoleMessageInfo {
	content: JSX.Element;
}

export class ConsoleMessage {
	public content: JSX.Element;

	public constructor(info: ConsoleMessageInfo) {
		const {
			content
		}: ConsoleMessageInfo = info;

		this.content = content;
	}
}

export interface ConsoleProps {

}

export interface ConsoleState {
	fadeIn: boolean;

	fadeOut: boolean;

	_visible: boolean;
	visible: boolean;

	messages: List<ConsoleMessage>;
}

export class Console extends Component<ConsoleProps, ConsoleState> {
	private input: RefObject<HTMLInputElement>;

	private latestMessage: RefObject<ConsoleMessageItem>;

	public prefix: string;

	public constructor(props: ConsoleProps) {
		super(props);

		this.input = React.createRef();

		this.latestMessage = React.createRef();

		this.state = {
			fadeIn: false,

			fadeOut: false,

			_visible: false,
			visible: false,

			messages: new List<ConsoleMessage>()
		};

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.onKeyDownGlobal = this.onKeyDownGlobal.bind(this);

		this.onInputKeyDown = this.onInputKeyDown.bind(this);

		this.prefix = '/';
	}

	public async componentDidMount(): Promise<void> {
		// this.attachEvents();

		this.runVersion();
	}

	private runVersion(): void {
		this.addMessage(new ConsoleMessage({
			content: (
				<>
					<span style={{ color: '#03a9f4' }}>
						&gt; <br />
						&gt; BetterTanki <span className="bt-console-markup__inline-code" style={{ color: 'inherit' }}>v{Runtime.get().version}</span><br />
						&gt; BetterTanki Console <span className="bt-console-markup__inline-code" style={{ color: 'inherit' }}>v0.1.0</span><br />
						&gt; <u>Console will be replaced with GUI in next major version!</u>
						&gt; <br />
					</span>
				</>
			)
		}));
	}

	public async componentWillUnmount(): Promise<void> {
		this.detachEvents();
	}

	private attachEvents(): void {
		document.body.addEventListener('keydown', this.onKeyDownGlobal);
	}

	private detachEvents(): void {
		document.body.removeEventListener('keydown', this.onKeyDownGlobal);
	}

	public async show(): Promise<void> {
		if(this.state._visible) return;

		this.attachEvents();

		this.setState({
			_visible: true
		});

		this.setState({
			fadeIn: true,

			visible: true
		}, () => {
			this.scrollToBottom();
		});

		await Bluebird.delay(200);

		this.setState({
			fadeIn: false
		});
	}

	public async hide(): Promise<void> {
		if(!this.state._visible) return;

		this.detachEvents();

		this.setState({
			_visible: false
		});

		this.setState({
			fadeOut: true
		});

		await Bluebird.delay(200);

		this.setState({
			fadeOut: false,
			visible: false
		});
	}

	private async onKeyDownGlobal(event: KeyboardEvent): Promise<void> {
		if(event.key === 'Escape') {
			event.stopPropagation();

			this.hide();
		}
	}

	private async onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
		const input: Nullable<HTMLInputElement> = this.input.current;
		if(!input) return;

		console.log(event.key);

		if(event.key === 'Enter') {
			const content: string = input.value;
			if(content.length < 1) return;

			input.value = '';

			await this.handleMessage(content);
		}
	}

	public addMessage(message: ConsoleMessage): void {
		this.state.messages.add(message);

		this.setState({
			messages: this.state.messages
		}, () => {
			this.scrollToBottom();
		});
	}

	private scrollToBottom(): void {
		if(!this.latestMessage.current) return;
		if(!this.latestMessage.current.wrapper.current) return;

		this.latestMessage.current.wrapper.current.scrollIntoView();
	}

	public async handleMessage(content: string): Promise<void> {
		this.addMessage(new ConsoleMessage({
			content: (
				<>
					&lt; {content}
				</>
			)
		}));

		const rawArgs: string[] = XRegExp.match(content, /[^" ]+|"(?:\\"|[^"])+"/, 'all');

		const command: string = rawArgs[0];
		const args: string[] = rawArgs
			.slice(1)
			.map((value: string) => {
				if(value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
				return value;
			});

		switch(command) {
			case 'version': {
				this.runVersion();
				break;
			}

			case 'crash': {
				const method: Nullable<string> = args[0] ?? null;

				if(method === null) {
					this.addMessage(new ConsoleMessage({
						content: (
							<>
								Укажите метод вызова критической ошибки.
							</>
						)
					}));
					return;
				}

				let unknown: boolean = false;

				switch(method) {
					case 'react-state': {
						Bt.Internals.TankiStore.state.system.fatalError = new ManuallyInitiatedCrashException('Modified React state');
						Bt.Internals.TankiStore.dispatchFunction({});

						break;
					}

					default: {
						unknown = true;

						this.addMessage(new ConsoleMessage({
							content: (
								<>
									Метод <span className="bt-console-markup__inline-code">{method}</span> не найден.
								</>
							)
						}));

						break;
					}
				}

				if(!unknown) {
					this.addMessage(new ConsoleMessage({
						content: (
							<>
								Метод <span className="bt-console-markup__inline-code">{method}</span> активирован.
							</>
						)
					}));
				}

				break;
			}

			case 'spectator': {
				Bt.Internals.spectator = !Bt.Internals.spectator;

				if(Bt.Internals.spectator) {
					this.addMessage(new ConsoleMessage({
						content: (
							<>
								<span>Режим наблюдателя включён.</span><br/>

								<br/>

								<span>Измените настройки управления: </span><br/>

								<span>&emsp;Перед заходом в битву: </span><br/>
								<span>&emsp;&emsp;Повернуть танк влево - <b>уберите</b> клавишу <span className="bt-console-markup__inline-code">A</span></span><br/>
								<span>&emsp;&emsp;Повернуть танк вправо - <b>уберите</b> клавишу <span className="bt-console-markup__inline-code">D</span></span><br/>
								<span>&emsp;&emsp;Двигаться вперёд - <b>установите</b> клавишу <span className="bt-console-markup__inline-code">W</span></span><br/>
								<span>&emsp;&emsp;Двигаться назад - <b>установите</b> клавишу <span className="bt-console-markup__inline-code">S</span></span><br/>

								<span>&emsp;После захода в битву: </span><br/>
								<span>&emsp;&emsp;Двигаться вперёд - <b>установите</b> клавишу, отличную от <span className="bt-console-markup__inline-code">W</span></span><br/>
								<span>&emsp;&emsp;Двигаться назад - <b>установите</b> клавишу, отличную от <span className="bt-console-markup__inline-code">S</span></span><br />

								<br/>

								<span>Управление наблюдателем: </span><br/>
								<span>&emsp;Открыть меню: <span className="bt-console-markup__inline-code">~</span></span><br/>
								<span>&emsp;Снять фокус с танка: <span className="bt-console-markup__inline-code">T</span></span><br/>
								<span>&emsp;Переключить блокировку курсора мыши: <span className="bt-console-markup__inline-code">O</span></span><br/>
								<span>&emsp;Переключить блокировку изменения высоты: <span className="bt-console-markup__inline-code">Пробел</span></span><br/>
								<span>&emsp;Установить точку: <span className="bt-console-markup__inline-code">Ctrl + 1-9</span></span><br/>
								<span>&emsp;Переместится к точке: <span className="bt-console-markup__inline-code">1-9</span></span><br/>
							</>
						)
					}));
				} else {
					this.addMessage(new ConsoleMessage({
						content: (
							<>
								Режим наблюдателя выключен.
							</>
						)
					}));
				}
				break;
			}

			case 'ignore': {
				const username: Nullable<string> = args[0] ?? null;

				const ignoreList: List<string> = Runtime.get().ignoreList;

				if(username === null) {
					this.addMessage(new ConsoleMessage({
						content: (
							<>
								Чёрный список: {ignoreList.map((username: string) => (
									<>
										<span className="bt-console-markup__inline-code">{username}</span>,
									</>
								))}
							</>
						)
					}));
					return;
				}

				const index: Nullable<number> = ignoreList.findKey((currentUsername: string) => username === currentUsername);
				if(index === null) {
					ignoreList.add(username);

					this.addMessage(new ConsoleMessage({
						content: (
							<>
								Пользователь <span className="bt-console-markup__inline-code">{username}</span> добавлен в чёрный список. Вы теперь не будете видеть его сообщения в чате.
							</>
						)
					}));
				} else {
					ignoreList.delete(index);

					this.addMessage(new ConsoleMessage({
						content: (
							<>
								Пользователь <span className="bt-console-markup__inline-code">{username}</span> удален из чёрного списка.
							</>
						)
					}));
				}
				break;
			}

			default: {
				this.addMessage(new ConsoleMessage({
					content: (
						<>
							console: <span className="bt-console-markup__inline-code">{command}</span>: команда не найдена
						</>
					)
				}));
				break;
			}
		}

		/* this.addMessage(new ConsoleMessage({
			content: (
				<>
					console: Commands must start with <span className="bt-console-markup__inline-code">{this.prefix}</span><br />
				</>
			)
		})); */
	}

	public render(): ReactNode {
		if(!this.state.visible) return null;

		return (
			<div
				className={`bt-console-container${this.state.fadeIn ? ' bt-console-container--fade-in' : ''}${this.state.fadeOut ? ' bt-console-container--fade-out' : ''}`}
				style={{
					color: '#ffffff'
				}}
			>
				<div className="bt-console-header">
					<span className="bt-console-title">Консоль</span>
				</div>
				<div className="bt-console">
					<div className="bt-console-messages-wrapper">
						<div className="bt-console-messages">
							{this.state.messages.map((message: ConsoleMessage, index: number) => {
								return (
									<ConsoleMessageItem
										key={index}
										message={message}
										ref={this.latestMessage} />
								);
							})}
						</div>
					</div>
					<input
						type="text"
						className="bt-console-input"
						placeholder="Введите команду"
						ref={this.input}
						onKeyDown={this.onInputKeyDown} />
				</div>
			</div>
		);
	}
}


export interface ConsoleMessageProps {
	message: ConsoleMessage;
}

export interface ConsoleMessageState {
}

export class ConsoleMessageItem extends Component<ConsoleMessageProps, ConsoleMessageState> {
	public wrapper: RefObject<HTMLDivElement>;

	public constructor(props: ConsoleMessageProps) {
		super(props);

		this.wrapper = React.createRef();

		this.state = {
		};
	}

	public render(): ReactNode {
		return (
			<div
				className="bt-console-message-wrapper"
				ref={this.wrapper}
			>
				<div className="bt-console-message">
					{this.props.message.content}
				</div>
		</div>
		);
	}
}
