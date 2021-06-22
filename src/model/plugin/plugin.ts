import { ReactNode } from 'react';
import { BitField } from '@assasans/bitfield';

import { Nullable } from '../../helper/type';

export class PluginFlags extends BitField {
	public static FLAGS = {

	};
}

export interface PluginInfo {
	id: number;

	name: string;
	author: string;
	version: string;
	description: string;

	flags: PluginFlags;
}

export class Plugin {
	public id: number;

	public name: string;
	public author: string;
	public version: string;
	public description: string;

	public flags: PluginFlags;

	public constructor(info: Plugin | PluginInfo) {
		this.id = info.id;

		this.name = info.name;
		this.author = info.author;
		this.version = info.version;
		this.description = info.description;

		this.flags = info.flags;
	}
}
