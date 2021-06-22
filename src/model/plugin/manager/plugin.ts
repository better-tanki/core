export interface PluginPartial {
	name: string;
	description: string;
	author: string;
	version: string;

	versions: PluginVersionPartial[];
}

export interface PluginVersionPartial {
	version: string;
	
	url: string;
	dir: string;
}
