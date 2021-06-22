import * as Classname from 'classnames';
import * as React from 'react';

import { Component, ReactNode } from 'react';

import { BaseProps } from '../props';

export interface ImageProps extends BaseProps {
	src: string;

	onClick?: (component: ImageView, event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ImageState {
	hover: boolean;
}

export class ImageView extends Component<ImageProps, ImageState> {
	public constructor(props: ImageProps) {
		super(props);

		this.state = {
			hover: false
		};

		this.onClick = this.onClick.bind(this);

		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
	}

	public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		if(this.props.onClick) this.props.onClick(this, event);
	}

	public onMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.setState({
			hover: true
		});
	}

	public onMouseLeave(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this.setState({
			hover: false
		});
	}

	public render(): ReactNode {
		const {
			src,
			id, className,
			style
		}: ImageProps = this.props;

		const {
			hover
		}: ImageState = this.state;

		return (
			<div
				className={Classname('image-container', className, {
					'image-container--hover': hover
				})}
				id={id}
				style={style}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onClick={this.onClick}
			>
				<img
					className={Classname('image')}
					src={src} />
			</div>
		);
	}
}
