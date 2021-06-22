import * as React from 'react';
import * as ReactRouter from 'react-router-dom';

import { Component, ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Preload } from './preload';
import { Plugins } from './plugins/manager';

import { Nullable } from '../helper/type';
import { Account } from '../model/plugin/accounts/account';

export interface AccountsProps {
	accounts: Account[];
}

export interface AccountsState {
	accounts: Account[];
}

export class Accounts extends Component<AccountsProps, AccountsState> {
	public constructor(props: AccountsProps) {
		super(props);

		this.state = {
			accounts: this.props.accounts
		};

		this.onClick = this.onClick.bind(this);
	}

	private onClick(component: AccountItem): void {
		const account: Account = component.props.account;

		const usernameElement: HTMLInputElement = document.querySelector('input#username')! as HTMLInputElement;
		const passwordElement: HTMLInputElement = document.querySelector('input#password')! as HTMLInputElement;

		usernameElement.value = account.username;
		passwordElement.value = account.password;

		const formElement: HTMLFormElement = document.querySelector('div[data-style="EntranceComponentStyle-ContainerForm"] > form')! as HTMLFormElement;

		const buttonElement: HTMLDivElement = document.querySelector('div[data-style="ButtonComponentStyle-disabled LoginComponentStyle-buttonEnd LoginComponentStyle-buttonPlay"], div[data-style="LoginComponentStyle-buttonPlay"]')! as HTMLDivElement
		buttonElement.click();

		/* if(formElement.checkValidity()) {
			buttonElement.classList.remove('lgLTvI');
			buttonElement.classList.add('fZFjHX');

			buttonElement.setAttribute('data-style', 'LoginComponentStyle-buttonPlay');
		} else {
			buttonElement.classList.remove('fZFjHX');
			buttonElement.classList.add('lgLTvI');

			buttonElement.setAttribute('data-style', 'ButtonComponentStyle-disabled LoginComponentStyle-buttonEnd LoginComponentStyle-buttonPlay');
		} */

		this.setState({
		});
	}

	public render(): React.ReactNode {
		return (
			<>
				<link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
				<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap" rel="stylesheet" />

				<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round" rel="stylesheet" />

				{this.state.accounts.map((account: Account, index: number) => (
					<AccountItem
						key={index}
						account={account}
						onClick={this.onClick} />
				))}
			</>
		);
	}
}

export interface AccountItemProps {
	account: Account;
	onClick?: (component: AccountItem) => void;
}

export interface AccountItemState {
}

export class AccountItem extends Component<AccountItemProps, AccountItemState> {
	private onClick: Nullable<(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>;

	public constructor(props: AccountItemProps) {
		super(props);

		this.state = {
		};

		this.onClick = this.props.onClick?.bind(this, this) ?? null;
	}

	public render(): ReactNode {
		const account: Account = this.props.account;

		return (
			<div
				className="btp-ma-account"
				onClick={this.onClick ?? undefined}
			>
				<span className="btp-ma-username">{account.username}</span>
				{/* <span className="btp-ma-password">{account.password}</span>
				<span className="btp-ma-password-encrypted">{Bt.Helpers.Buffer
					.getOctets(account.passwordEncrypted)
					.map((octet: number) => octet.toString(16))
					.join(' ')}</span> */}
					
					<span className="material-icons-round btp-ma-edit">settings</span>
			</div>
		);
	}
}
