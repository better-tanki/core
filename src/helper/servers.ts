import * as rp from 'request-promise';

import { List } from '@assasans/storage';
import { Exception } from '../error/exception';

interface MainServersResponse {
	nodes: MainServerRecords;
}

interface MainServerRecords {
	[node: string]: MainServerPartial;
}

interface MainServerPartial {
	endpoint: MainServerEndpointPartial;

	online: number;
	inbattles: number;
}

interface MainServerEndpointPartial {
	host: string;
}

export interface IServer {
	name: string;

	host: string;
	url: string;

	online: number;
}

export abstract class MainServer implements IServer {
	public name: string;
	public host: string;

	public online: number;
	public inBattles: number;

	public constructor(name: string, partial: MainServerPartial) {
		const {
			endpoint,
			online, inbattles
		}: MainServerPartial = partial;

		this.name = name;
		this.host = endpoint.host;

		this.online = online;
		this.inBattles = inbattles;
	}
	
	public get url(): string {
		throw new Exception('Stub method');
	}
}

export class MainEuropeServer extends MainServer {
	public get url(): string {
		// if(!this.host.includes('tankonline.com')) return `https://tankionline.com/play/?config-template=http://${this.host}:7771/config.xml&resources=https://s.eu.tankionline.com&rnd=${Date.now()}&desktop=true`;
		
		return `https://tankionline.com/play/?config-template=https://c{server}.eu.tankionline.com/config.xml&resources=https://s.eu.tankionline.com&rnd=${Date.now()}&desktop=true`;
	}
}

export class MainChinaServer extends MainServer {
	public get url(): string {
		return `https://3dtank.com/play/?config-template=https://c{server}.eu.tankionline.com/config.xml&resources=https://s.eu.tankionline.com&rnd=${Date.now()}&desktop=true`;
	}
}

interface TestServerPartial {
	Release: string;
	Domain: string;
	UserCount: number;
}

export class TestServer implements IServer {
	public name: string;
	public host: string;

	public online: number;

	public constructor(partial: TestServerPartial) {
		const {
			Release, Domain,
			UserCount
		}: TestServerPartial = partial;

		this.name = Release;
		this.host = Domain;

		this.online = UserCount;
	}

	public get url(): string {	
		return `https://${this.host}/browser-public/index.html?config-template=https://c{server}.${this.host}/config.xml&resources=../resources&balancer=https://balancer.${this.host}/balancer`;
	}
}

export class ServerHelper {
	private constructor() {}

	public static async getMainServersEurope(): Promise<List<MainServer>> {
		const response: MainServersResponse = await rp({
			uri: 'https://tankionline.com/s/status.js',
			method: 'GET',
			json: true
		});

		const partials: MainServerRecords = response.nodes;

		const servers: List<MainServer> = new List<MainServer>();

		servers.add(new MainEuropeServer('Transparent Proxy', {
			endpoint: {
				host: 'localhost'
			},
			inbattles: 0,
			online: 0
		}));

		Object.entries(partials).forEach(([ name, partial ]: [ string, MainServerPartial ]) => servers.add(new MainEuropeServer(name, partial)));

		return servers;
	}

	public static async getMainServersChina(): Promise<List<MainServer>> {
		const response: MainServersResponse = await rp({
			uri: 'https://3dtank.com/s/status.js',
			method: 'GET',
			json: true
		});

		const partials: MainServerRecords = response.nodes;

		const servers: List<MainServer> = new List<MainServer>();
		Object.entries(partials).forEach(([ name, partial ]: [ string, MainServerPartial ]) => servers.add(new MainChinaServer(name, partial)));

		return servers;
	}

	public static async getTestServers(): Promise<List<TestServer>> {
		const partials: TestServerPartial[] = await rp({
			uri: 'https://test.tankionline.com/public_test',
			method: 'GET',
			json: true
		});

		return List.fromArray(partials.map((partial: TestServerPartial) => new TestServer(partial)));
	}
}
