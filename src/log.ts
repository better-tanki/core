import * as log4js from 'log4js';
import * as chalk from 'chalk';
import * as path from 'path';

import { Runtime } from './runtime';

export const Log = {
	preinit: log4js.getLogger('PreInit'),
	main: log4js.getLogger('Main'),

	client: log4js.getLogger('Client'),
	preload: log4js.getLogger('Preload'),
	plugin: log4js.getLogger('Plugin'),
	
	cdp: log4js.getLogger('CDP')
};

export function registerLogs(): void {
	log4js.configure({
		appenders: {
			console: {
				type: 'console',
				layout: {
					type: 'pattern',
					pattern: `[%d{hh:mm:ss}] [%p/%c]: %x{data}`,
					tokens: {
						data: function(event: log4js.LoggingEvent) {
							return event.data.join(' ').replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
						}
					}
				}
				/*
				layout: {
					type: 'pattern',
					pattern: `%[[%d{hh:mm:ss}] [%p/${chalk.bold('%c')}]%]: %m`
				}
				*/
			},
			file: {
				type: 'file',
				filename: path.join(Runtime.userData, 'logs/client.log'),
				pattern: 'yyyy-MM-dd',
				maxLogSize: 1024 * 1024 * 1024 * 8,
				backups: 128,
				compress: true,
				keepFileExt: true,
				layout: {
					type: 'pattern',
					pattern: `[%d{hh:mm:ss}] [%p/%c]: %x{data}`,
					tokens: {
						data: function(event: log4js.LoggingEvent) {
							return event.data.join(' ').replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
						}
					}
				}
			}
		},
		categories: {
			default: {
				appenders: [
					'console',
					'file'
				],
				level: 'trace'
			}
		}
	});
}
