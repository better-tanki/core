import 'source-map-support/register';

import Logger, { registerLoggers } from './helper/logger';
registerLoggers();

import * as minimist from 'minimist';
import * as chalk from 'chalk';
import * as path from 'path';
import * as _ from 'lodash';

import { app, BrowserWindow } from 'electron';

Logger.preinit.info('BetterTanki starting...');
const args = minimist(
	process.argv.slice(2),
	{
		boolean: [
			'fallback'
		]
	}
);

function createWindow() {
  const window: BrowserWindow = new BrowserWindow({
		width: 1024,
		height: 1024,
		show: false,
		fullscreenable: true,
		frame: true,
		backgroundColor: '#565769',
    webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
  });

	if(args.fallback) {
		//TODO
		//global.__fallback = true;

		window.loadURL(`https://tankionline.com/play/?config-template=https://c{server}.eu.tankionline.com/config.xml&resources=https://s.eu.tankionline.com&rnd=${Date.now()}&desktop=true`);
	} else {
		window.loadFile(path.join(__dirname, '../static/html/main.html'), {
			query: {
				'config-template': 'https://c{server}.eu.tankionline.com/config.xml',
				'resources': 'https://s.eu.tankionline.com',
				//'config-template': 'https://c{server}.public-deploy2.test-eu.tankionline.com/config.xml',
				//'resources': '../resources',
				'rnd': Date.now().toString(),
				'desktop': 'true'
			}
		});
	}
	
	window.removeMenu();
	window.maximize();
	window.show();

	//window.webContents.openDevTools();
	
	window.on('enter-html-full-screen', () => window.setFullScreen(true));
	window.on('leave-html-full-screen', () => window.setFullScreen(false));
}

app.on('ready', () => {
  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit();
});
