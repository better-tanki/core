import 'source-map-support/register';

import * as appRoot from 'app-root-path';

import { app } from 'electron';

appRoot.setPath(app.getPath('userData'));

import { Log, registerLogs } from './log';
registerLogs();

Log.preinit.info(`Configuration dir: ${appRoot.path}`);

import './app';
