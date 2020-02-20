import * as path from 'path';
import rs from 'resting-squirrel';

import Controller from '../src';

const app = rs({ log: true, responseStrictValidation: true });

(async () => {
	await Controller.registerDirectory(app, path.resolve(__dirname, './data/controllers'));
	app.start();
})();
